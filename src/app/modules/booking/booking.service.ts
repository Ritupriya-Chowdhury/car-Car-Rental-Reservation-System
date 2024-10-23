import mongoose from 'mongoose';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { Cars } from '../cars/cars.model';


// Create booking
const createBookingIntoDB = async (payload: TBooking, user: JwtPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userByEmail = await User.findOne({ email: user.email }).session(session);

    if (!userByEmail) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const carById = await Cars.findOneAndUpdate(
      { _id: payload.carId },
      { new: true }
    ).session(session);

    if (!carById) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car Not Found!');
    }

    const booking = {
      date: payload.date,
      startTime: payload.startTime,
      user: userByEmail._id,
      car: carById._id,
      nidOrPassport: payload.nidOrPassport,
      drivingLicense: payload.drivingLicense,
      paymentDetails: payload.paymentDetails,
      additionalOptions: payload.additionalOptions,
    
    };

    const [result] = await Booking.create([booking], { session });
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw new Error(err as string);
  } finally {
    session.endSession();
  }
};

const updateBookingIntoDB = async (bookingId: string, payload: TBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the existing booking by ID
    const existingBooking = await Booking.findById(bookingId).session(session);
    if (!existingBooking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
    }

 
    
    // Update the existing booking fields
    existingBooking.date = payload.date || existingBooking.date;
    existingBooking.startTime = payload.startTime || existingBooking.startTime;
    existingBooking.nidOrPassport = payload.nidOrPassport || existingBooking.nidOrPassport;
    existingBooking.drivingLicense = payload.drivingLicense || existingBooking.drivingLicense;
    existingBooking.paymentDetails = payload.paymentDetails || existingBooking.paymentDetails;
    existingBooking.additionalOptions = payload.additionalOptions || existingBooking.additionalOptions;

    const updatedBooking = await existingBooking.save({ session });

    await session.commitTransaction();
    return updatedBooking;
  } catch (err) {
    await session.abortTransaction();
    throw new Error(err as string);
  } finally {
    session.endSession();
  }
};


// Get booking by ID
const getBookingById = async (bookingId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findById(bookingId)
      .populate('user', '-createdAt -updatedAt -password')
      .populate('car')
      .session(session);

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
    }

    await session.commitTransaction();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

// Get all bookings
const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const session = await mongoose.startSession();


  try {
    session.startTransaction();
    const { date, carId } = query;
    let filter: Record<string, unknown> = {
      isCancels: false, 
      confirmation: true,  
    };
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
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

// Get My bookings
const getMyBookingsFromDB = async (user: JwtPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const email = user.email;
    
   
    const userData = await User.findOne({ email }).session(session);
   
    let filter: Record<string, unknown> = {
      user: userData?._id,
      isCancels: false, 
      confirmation: true, 
    };
    const result = await Booking.find(filter)
      .populate('user', '-createdAt -updatedAt -password')
      .populate('car');

      console.log(result);

    if (!result.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Booking Found');
    }

    await session.commitTransaction();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

// Return car
const returnCar = async (bookingId: string, endTime: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found!');
    }

    booking.endTime = endTime;
    await booking.save({ session });

    const car = await Cars.findById(booking.car).session(session);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car Not Found!');
    }

    const startTime = new Date(`${booking.date}T${booking.startTime}`);
    const endTimeDate = new Date(`${booking.date}T${endTime}`);
    const durationInHours = (endTimeDate.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    booking.totalCost = durationInHours * car.pricePerHour;
    await booking.save({ session });

    car.status = "available";
    await car.save({ session });

    await (await booking.populate('user', '-createdAt -updatedAt -password')).populate('car');

    await session.commitTransaction();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

// Confirm booking
const confirmBooking = async (bookingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found!');
    }

    booking.confirmation = true; // Update the booking status
    await booking.save({ session });

    await session.commitTransaction();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

// Cancel booking
const cancelBooking = async (bookingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found!');
    }

    booking.isCancels = true; // Update the booking status
    await booking.save({ session });

    // Optionally, make the car available again
    const car = await Cars.findById(booking.car).session(session);
    if (car) {
      car.status = 'available';
      await car.save({ session });
    }

    await session.commitTransaction();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};


type BookingStatus = "Pending" | "Approve" | "Cancel";

// Change booking status
const changeBookingStatus = async (bookingId: string, status:  BookingStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found!');
    }

 
    booking.status = status;
    await booking.save({ session });

   
    if (status === 'Approve') {
      const car = await Cars.findById(booking.car).session(session);
      if (!car) {
        throw new AppError(httpStatus.NOT_FOUND, 'Car Not Found!');
      }

      car.status = 'unavailable'; 
      await car.save({ session });
    }

    await session.commitTransaction();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

export const BookingsServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  returnCar,
  getBookingById,
  updateBookingIntoDB,
  confirmBooking,
  cancelBooking,
  changeBookingStatus
};
