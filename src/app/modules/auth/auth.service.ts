import mongoose from "mongoose";
import config from "../../config";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TSignInUser } from "./auth.interface";
import { createToken } from "./auth.utils";

const createUserIntoDB = async (payload: TUser) => {
  

    // If password is not given, use default password
    if(!payload.password)
    payload.password= (config.default_password as string);
  
    
    const session=await mongoose.startSession();
    
  
    try{
      session.startTransaction();
      
  
      const [user] = await User.create([payload],{session});
  
      if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }
    
      await session.commitTransaction();
      await session.endSession();
  
      return user;
     
  
   }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
   }
   };


const signInUser = async (payload: TSignInUser) => {
  

  const user= await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

// Checking is the password correct or not
if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,

  );
  
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,

  );


  return{
      user,
      token,
      refreshToken
  
  };
   };



  
  export const AuthServices = {
    createUserIntoDB,
    signInUser

  };