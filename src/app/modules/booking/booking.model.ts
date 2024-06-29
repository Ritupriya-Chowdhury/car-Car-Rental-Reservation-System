import { Schema, Types, model } from "mongoose";
import {  TBookingResponse } from "./booking.interface";




const bookingSchema = new Schema<TBookingResponse>
({
    date: 
    { 
        type: String, 
        required: true 
    },
    startTime: 
    { 
        type: String, 
        required: true 
    },
    endTime: 
    { 
        type: String, 
        default: null 
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
      car: {
        type: Types.ObjectId,
        ref: 'Cars',
        required: true,
      },
    totalCost: 
    { 
        type: Number, 
        default:0
       
     },
  }, 
  { 
    timestamps: true 
});


export const Booking = model<TBookingResponse>('Booking', bookingSchema);