import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { TUserDocument, User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TSignInUser } from './auth.interface';
import { createToken } from './auth.utils';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';
import { TUser } from '../user/user.interface';
import config from '../../config';

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
    const user = (await User.isUserExistsByEmail(decoded.email)) as TUserDocument;

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

// Update user's status by email
const updateUserStatusByEmail = async (email: string, status: 'activate' | 'block') => {
  const user = await User.findOneAndUpdate({ email }, { status }, { new: true });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Update user's role by email
const updateUserRoleByEmail = async (email: string, role: 'admin' | 'user') => {
  if (!['admin', 'user'].includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid role provided');
  }

  const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Request password reset
const requestPasswordReset = async (email: string) => {
  const user = (await User.isUserExistsByEmail(email)) as TUserDocument;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

  await user.save();

  const resetLink = `${config.reset_password_link}?token=${token}`;
  const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;

  await sendEmail(user.email, message);
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
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

// Find user by email
const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDelete) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === 'block') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  return user;
};

// AuthService to get all users
const getAllUsers = async () => {
  return await User.find({ isDeleted: false }); // Exclude users with isDeleted: true
};



// Change user password
const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if old password is correct
  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect old password');
  }

  // Hash new password before saving
  user.password = newPassword;
  await user.save();
};

const updateUserProfile = async (email: string, updates: Partial<TUser>) => {
  const user = await User.findOneAndUpdate({ email }, updates, { new: true });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const deleteUserByEmail = async (email: string) => {
  const user = await User.findOneAndUpdate(
      { email },
      { isDeleted: true },
      { new: true }
  );

  if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return { message: 'User soft deleted successfully', user };
};

export const AuthServices = {
  createUserIntoDB,
  signInUser,
  refreshToken,
  updateUserStatusByEmail,
  updateUserRoleByEmail,
  requestPasswordReset,
  resetPassword,
  findUserByEmail,
  changePassword,
  updateUserProfile,
  getAllUsers,
  deleteUserByEmail 
};