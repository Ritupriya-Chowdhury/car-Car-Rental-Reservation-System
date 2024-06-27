import mongoose from "mongoose";
import { TCars } from "./cars.interface";
import { Cars } from "./cars.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

//create cars
const createCarsIntoDB = async (payload: TCars) => {

    const session=await mongoose.startSession();
  
    try{
      session.startTransaction();
  
     
      const [result] = await Cars.create([payload],{session});
  
      if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Car');
      }
  
      await session.commitTransaction();
      await session.endSession();
  
      return result;
  
   }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  
   }
  
  };


  export const CarsServices = {
    createCarsIntoDB,
    // getSingleMeetingRoomFromDB,
    // getAllMeetingRoomsFromDB,
    // updateMeetingRoomIntoDB,
    // deleteMeetingRoomFromDB 
};
  
  