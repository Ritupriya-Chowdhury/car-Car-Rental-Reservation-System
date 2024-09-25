import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const createUser = catchAsync(async (req, res) => {
    const payload = req.body;
  
   //console.log(req.body);
    const result = await AuthServices.createUserIntoDB(payload);
    //console.log(result);
  
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data:{
        _id:result._id,
        name:result.name,
        email:result.email,
        role:result.role,
        phone:result.phone,
        address:result.address,
        createAt:result.createdAt,
        updateAt:result.updatedAt

      },
        
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
      data: {
        _id: result.user._id,
        name: result.user.name,
        email:result.user.email,
        role: result.user.role,
        phone: result.user.phone,
        address: result.user.address,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
    },
    token: result.token,

    });
  });


  export const AuthControllers={
    createUser,
    signInUser

  }