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
// Get all cars from the database
const getAllCarsFromDB = async (filters: any) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const query: any = { isDeleted: { $ne: true } };

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.type) {
      query.carType = { $regex: filters.type, $options: 'i' };
    }

    if (filters.minPrice && filters.maxPrice) {
      query.pricePerHour = {
        $gte: filters.minPrice,
        $lte: filters.maxPrice,
      };
    }

    // Modify the isElectric filter logic
    if (filters.isElectric !== undefined) {
      // If isElectric is 'true', show all cars regardless of isElectric value
      if (filters.isElectric === 'true') {
        // No additional filter is needed; we won't add isElectric to the query
      } else {
        // If isElectric is 'false', filter to only show non-electric cars
        query.isElectric = false; // Adjust the condition for false
      }
    }

    if (filters.location) {
      query.location = filters.location;
    }

    if (filters.features && filters.features.length > 0) {
      query.features = { $all: filters.features }; // Ensure all features match
    }

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      query.$or = [
        { status: 'available' },
        {
          $and: [
            { startDate: { $not: { $lte: endDate } },
            },
            { endDate: { $not: { $gte: startDate } } },
          ],
        },
      ];
    }

    console.log(query); // Log the query for debugging
    const result = await Cars.find(query);

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Cars Found');
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
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

 const addCustomerReview = async (id: string, reviewObject: { customerReviews: string }) => {
  const car = await Cars.findById(id);

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  const review = reviewObject.customerReviews; 
  console.log(review)
car.customerReviews.push(review);             
  await car.save();                            

  return car.customerReviews;                   

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
 
 const checkCarAvailability = async (location: string, startDate: Date, endDate: Date) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Query to find cars in the specific location and not booked within the date range
    const result = await Cars.find({
      location,
      $or: [
        { status: 'available' },  // Assuming status is a field for car availability
        {
          $and: [
            { startDate: { $not: { $lte: endDate } } },  // Not booked for the provided dates
            { endDate: { $not: { $gte: startDate } } },
          ],
        },
      ],
    });

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Available Cars Found');
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
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
    deleteCarFromDB,
    checkCarAvailability, 
    addCustomerReview
};
  
  