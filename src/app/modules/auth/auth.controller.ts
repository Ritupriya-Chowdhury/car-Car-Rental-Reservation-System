import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
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
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: result,
  });
});

// Controller to update user status (admin-only functionality)
const updateUserStatus = catchAsync(async (req, res) => {
  const { userId, status } = req.body;

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
  updateUserStatus,
  updateUserRole,
};
