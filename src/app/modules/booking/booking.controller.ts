import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingsServices } from './booking.service';

//create booking
const createBooking = catchAsync(async (req, res) => {
  //console.log(req)

  const result = await BookingsServices.createBookingIntoDB(req.body, req.user);
  // console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Car booked successfully',
    data: result,
  });
});


// Get All Bookings
const getAllBookings = catchAsync(async (req, res,next) => {
 
  const result = await BookingsServices.getAllBookingsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });

});

// Get My Bookings
const getMyBookings = catchAsync(async (req, res) => {
 
  const result = await BookingsServices.getMyBookingsFromDB(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });

});


// return car
const  returnCar = catchAsync(async (req, res,next) => {

  const { bookingId, endTime } = req.body;

  const result = await BookingsServices.returnCar(bookingId, endTime);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car returned successfully',
    data: result,
  });
});


export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  returnCar,
  // deleteCar
};
