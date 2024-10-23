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


  export type TBooking = {
    carId?: Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
    user?: TUser;
    car?:TCars;
    totalCost: number;
    nidOrPassport: string;
    drivingLicense: string;
    paymentDetails: {
      cardNumber: string;
      expiry: string;
      cvv: string;
    };
    paymentStatus: 'Done'| 'Not Done Yet';
    additionalOptions: {
      gps?: boolean;
      childSeat?: boolean;
    };
    status: 'Pending'| 'Approve'|'Cancel';
    confirmation:boolean;
    isCancels: boolean;
  };
  

  
  export type TReturnCar={
    bookingId?: Types.ObjectId;
    endTime:string;

  }


