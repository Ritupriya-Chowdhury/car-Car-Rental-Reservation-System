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


  //Get single car
const getSingleCarFromDB = async (id: string) => {
 

  const session=await mongoose.startSession();
 
   try{
     session.startTransaction();
 
    
     const result = await Cars.findById(id);
 
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
 
 // Get all cars
 const getAllCarsFromDB = async () => {
 
   const session=await mongoose.startSession();
 
   try{
     session.startTransaction();
 
    
     const result = await Cars.find();
 
     if (!result.length) {
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
 
 
 //update meeting room
 const updateCarIntoDB = async ( id: string, payload: Partial<TCars>) => {
 
   const session=await mongoose.startSession();
 
   try{
     session.startTransaction();
 
    
     const result = await Cars.findOneAndUpdate(
       { _id: id },
       payload,
       {
         new: true,
       },
     );
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
 
 
 // Delete room
 const deleteCarFromDB = async (id: string) => {
   // console.log(id);
   const session=await mongoose.startSession();
 
   try{
     session.startTransaction();
 
    
     const result = await Cars.findOneAndUpdate(
       {_id:id},
       {isDeleted:true},
       { new: true }
       );
 
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
 
 


  export const CarsServices = {
    createCarsIntoDB,
    getSingleCarFromDB,
    getAllCarsFromDB,
    updateCarIntoDB,
    deleteCarFromDB 
};
  
  