import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import AppError from "../../errors/AppError";

// Controller to handle user creation
const createUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

// Controller to handle user sign-in
const signInUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.signInUser(payload);

  // Set refresh token in a cookie
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

// Controller to handle token refresh
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token not provided');
  }

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: result,
  });
});

// Controller to request password reset
const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthServices.requestPasswordReset(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset email sent successfully",
    data: undefined
  });
});

// Controller to reset password
const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  await AuthServices.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: undefined
  });
});

// Controller to update user status (admin-only functionality)
const updateUserStatus = catchAsync(async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID and status are required');
  }

  const result = await AuthServices.updateUserStatusById(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

// Controller to update user role (admin-only functionality)
const updateUserRole = catchAsync(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID and role are required');
  }

  const result = await AuthServices.updateUserRoleById(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

// Export all controllers
export const AuthControllers = {
  createUser,
  signInUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  updateUserStatus,
  updateUserRole,
};
