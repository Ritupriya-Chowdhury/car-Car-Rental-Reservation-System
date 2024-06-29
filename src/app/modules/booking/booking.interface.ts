import { Types } from "mongoose";
import { TUser } from "../user/user.interface";
import { TCars } from "../cars/cars.interface";




export type TBookingResponse = {
    _id?: Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    user?: TUser;
    car?:TCars;
    totalCost: number;
    createdAt?: Date;
    updatedAt?: Date;
  };


  export type TBooking={
    carId?: Types.ObjectId;
    date:string;
    startTime:string;

  }

  
  export type TReturnCar={
    bookingId?: Types.ObjectId;
    endTime:string;

  }


