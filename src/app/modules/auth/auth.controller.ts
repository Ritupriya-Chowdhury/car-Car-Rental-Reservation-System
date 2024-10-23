import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errors/AppError";
import config from "../../config";

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
  const { email, status } = req.body;

  if (!email || !status) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and status are required');
  }

  const result = await AuthServices.updateUserStatusByEmail(email, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

// Controller to update user role (admin-only functionality)
const updateUserRole = catchAsync(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and role are required');
  }

  const result = await AuthServices.updateUserRoleByEmail(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

// Controller to find user by email
const findUserByEmail = catchAsync(async (req, res) => {
  const email = req.user.email ;
  

  const user = await AuthServices.findUserByEmail(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

// Controller for changing the password
const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userEmail = req.user.email; 

  await AuthServices.changePassword(userEmail, oldPassword, newPassword); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: newPassword,
  });
});

// Controller to update user profile
const updateUserProfile = catchAsync(async (req, res) => {
  const userEmail = req.user.email; // Assuming the user's email is attached to the request after authentication
  const updateData = req.body; // The fields to update

  // Ensure that the updateData contains at least one field to update
  if (Object.keys(updateData).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No fields provided for update');
  }

  const result = await AuthServices.updateUserProfile(userEmail, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
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
  findUserByEmail,
  changePassword,
  updateUserProfile, 
};
