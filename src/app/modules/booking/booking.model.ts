import { Schema, Types, model } from "mongoose";
import { TBooking, TBookingResponse } from "./booking.interface";

const bookingSchema = new Schema<TBooking>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: '00:00'},
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
  totalCost: { type: Number, default: 0 },
  nidOrPassport: { type: String, required: true },
  drivingLicense: { type: String, required: true },

  paymentDetails: {
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ['Done', 'Not Done Yet'],
    default: 'Not Done Yet',
  },
  additionalOptions: {
    gps: { type: Boolean, default: false },
    childSeat: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['Pending','Approve', 'Cancel'],
    default: 'Pending',
  },
  confirmation:{
    type: Boolean,
    default: false,
  },
  isCancels:{
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


export const Booking = model<TBooking>('Booking', bookingSchema);
