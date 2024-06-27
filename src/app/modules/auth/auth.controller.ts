import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const createUser = catchAsync(async (req, res) => {
    const payload = req.body;
  
   //console.log(req.body);
    const result = await AuthServices.createUserIntoDB(payload);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });


  export const AuthControllers={
    createUser

  }