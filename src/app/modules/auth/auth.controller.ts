import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import AppError from "../../errors/AppError";

const createUser = catchAsync(async (req, res) => {
    const payload = req.body;
  
   //console.log(req.body);
    const result = await AuthServices.createUserIntoDB(payload);
    //console.log(result);
  
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data:result
        
    });
  });

  

const signInUser = catchAsync(async (req, res) => {
    const payload = req.body;
  
   //console.log(req.body);
    const result = await AuthServices.signInUser(payload);
    const {refreshToken}=result
    res.cookie('refreshToken',refreshToken,{
      secure: config.NODE_ENV=== 'production',
      httpOnly: true,
    })
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: result
     

    });
  });



  const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    });
  });
  


  export const AuthControllers={
    createUser,
    signInUser,
    refreshToken

  }