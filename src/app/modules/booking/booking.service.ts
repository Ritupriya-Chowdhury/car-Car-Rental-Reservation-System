import mongoose from 'mongoose';
import { TBooking, TReturnCar } from './booking.interface';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { Cars } from '../cars/cars.model';

//create booking
const createBookingIntoDB = async (payload: TBooking, user: JwtPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //console.log(user)
    const email = user.email;
    const userByEmail = await User.findOne({ email })
      .select('-createdAt -updatedAt -password')
      .session(session);
    if (!userByEmail) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    const carById = await Cars.findOneAndUpdate(
      { _id: { $in: payload.carId } },
      { $set: { status: 'unavailable' } },
      {
        new: true,
      },
    ).session(session);

    if (!carById) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car Not Found!');
    }


    const booking = {
      date: payload.date,
      startTime: payload.startTime,
      user: userByEmail?._id,
      car: carById?._id,
    };

    const [result] = await Booking.create([booking], { session });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to booked Car');
    }

    await (
      await result.populate('user', '-createdAt -updatedAt -password')
    ).populate('car');
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};




// Get all bookings
const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { date, carId } = query;
    let filter = {};

    if (carId) {
      filter = { ...filter, car: carId };
    }
    if (date) {
      filter = { ...filter, date };
    }

    const result = await Booking.find(filter)
      .populate('user', '-createdAt -updatedAt -password')
      .populate('car');

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Booking Found');
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





// Get My bookings
const getMyBookingsFromDB = async (user: JwtPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const email = user.email;
  

    const userData = await User.findOne({ email }).session(session);
    const result = await Booking.find({ user: userData?._id })
      .populate('user', '-createdAt -updatedAt -password')
      .populate('car');

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Booking Found');
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




// Return car
const returnCar = async (bookingId: string, endTime: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the booking by its ID
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found!');
    }

    // Update the booking endTime
    booking.endTime = endTime;
    await booking.save({ session });

    // Calculate the total cost (Assuming pricePerHour is stored in the car model)
    const car = await Cars.findById(booking.car).session(session);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car Not Found!');
    }

    // Calculate total cost (this part may need adjustment depending on your schema)
    const startTime = new Date(`${booking.date}T${booking.startTime}`);
    const endTimeDate = new Date(`${booking.date}T${endTime}`);
    const durationInHours = (endTimeDate.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    booking.totalCost = durationInHours * car.pricePerHour;
    await booking.save({ session });

    // Update car status to available
    car.status = "available";
    await car.save({ session });

    await (await booking.populate('user', '-createdAt -updatedAt -password')).populate('car');

    await session.commitTransaction();
    await session.endSession();

    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


export const BookingsServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  returnCar,
  // deleteCarFromDB
};
