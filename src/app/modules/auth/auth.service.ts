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

// Create a user in the database
const createUserIntoDB = async (payload: TUser) => {
  // If password is not provided, use the default password
  if (!payload.password) payload.password = config.default_password as string;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [user] = await User.create([payload], { session });

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return user;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

// Sign-in logic for users
const signInUser = async (payload: TSignInUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the password matches
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password');
  }

  // Generate JWT tokens
  const jwtPayload = {
    _id: user._id, // Include user ID in the token payload
    email: user.email,
    role: user.role,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    user,
    token,
    refreshToken,
  };
};

// Refresh access token using refresh token
const refreshToken = async (token: string) => {
  try {
    // Validate refresh token
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string
    ) as JwtPayload;

    const { email } = decoded;

    // Check if user exists
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Create a new access token
    const jwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

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
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true } // Return the updated document
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Update user's role by _id
const updateUserRoleById = async (userId: Types.ObjectId, role: 'admin' | 'user') => {
  // Validate role
  if (!['admin', 'user'].includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid role provided');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Request password reset
const requestPasswordReset = async (email: string) => {
  // Ensure user is fetched as TUserDocument
  const user = await User.isUserExistsByEmail(email) as TUserDocument;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

  await user.save(); // Use the save method from Mongoose

  const resetLink = `${config.reset_password_link}?token=${token}`;

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

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

export const AuthServices = {
  createUserIntoDB,
  signInUser,
  refreshToken,
  updateUserStatusById,
  updateUserRoleById,
  requestPasswordReset,
  resetPassword,
};
