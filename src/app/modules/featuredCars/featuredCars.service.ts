import mongoose from "mongoose";
import { TFeaturedCars } from "./featuredCars.interface";
import { FeaturedCars } from "./featuredCars.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

//create cars
const createFeaturedCarsIntoDB = async (payload: TFeaturedCars) => {

    const session=await mongoose.startSession();
  
    try{
      session.startTransaction();
  
     
      const [result] = await FeaturedCars.create([payload],{session});
  
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


  //Get single car
const getAllFeaturedCarFromDB = async () => {
 

  const session=await mongoose.startSession();
 
   try{
     session.startTransaction();
 
    
     const result = await FeaturedCars.find();
 
     if (!result) {
       throw new AppError(httpStatus.NOT_FOUND, 'No Data Found')
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

 export const FeaturedCarsServices = {
    createFeaturedCarsIntoDB,
    getAllFeaturedCarFromDB,
    
};
 