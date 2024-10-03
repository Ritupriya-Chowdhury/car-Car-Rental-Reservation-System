import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import config from '../../config';
import { TUser } from '../user/user.interface';
import { TUserDocument, User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TSignInUser } from './auth.interface';
import { createToken } from './auth.utils';
import sendEmail from '../../utils/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Create a user in the database
const createUserIntoDB = async (payload: TUser) => {
  if (!payload.password) {
    payload.password = config.default_password as string;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.create([payload], { session });
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    return user;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  } finally {
    session.endSession();
  }
};

// Sign-in logic for users
const signInUser = async (payload: TSignInUser) => {
  const user = await User.isUserExistsByEmail(payload.email) as TUserDocument;
 

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordCorrect = await User.isPasswordMatched(payload.password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password');
  }

  const jwtPayload = { _id: user._id, email: user.email, role: user.role };

  const token = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

  return { user, token, refreshToken };
};

// Refresh access token using refresh token
const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;
    const user = await User.isUserExistsByEmail(decoded.email) as TUserDocument;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const jwtPayload = { _id: user._id, email: user.email, role: user.role };
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return { accessToken };
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token expired');
    }
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

// Update user's status by _id
const updateUserStatusById = async (userId: Types.ObjectId, status: 'activate' | 'block') => {
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Update user's role by _id
const updateUserRoleById = async (userId: Types.ObjectId, role: 'admin' | 'user') => {
  if (!['admin', 'user'].includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid role provided');
  }

  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Request password reset
const requestPasswordReset = async (email: string) => {
  console.log('email:',email)
  const user = await User.isUserExistsByEmail(email) as TUserDocument;
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  console.log(token)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

  await user.save();

  const resetLink = `${config.reset_password_link}?token=${token}`;
  console.log(resetLink)
  const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;

  await sendEmail(user.email, 'Password Reset Request', message);
};

// Reset password
const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }, // Check if the token has expired
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password reset token is invalid or has expired');
  }

  // Hash new password before saving
  user.password = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};


// Find user by ID
const findUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const AuthServices = {
  createUserIntoDB,
  signInUser,
  refreshToken,
  updateUserStatusById,
  updateUserRoleById,
  requestPasswordReset,
  resetPassword,
  findUserById
};
