import mongoose from "mongoose";
import config from "../../config";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createUserIntoDB = async (payload: TUser) => {
  

    // If password is not given, use default password
    if(!payload.password)
    payload.password= (config.default_password as string);
  
    
    const session=await mongoose.startSession();
    
  
    try{
      session.startTransaction();
      
  
      const newUser = await User.create([payload],{session});
  
      if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }
    
      await session.commitTransaction();
      await session.endSession();
  
      return newUser;
  
   }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
   }
   };
  
  export const AuthServices = {
    createUserIntoDB

  };