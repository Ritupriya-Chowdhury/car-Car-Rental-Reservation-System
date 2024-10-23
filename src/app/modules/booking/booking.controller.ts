import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingsServices } from './booking.service';

// Create a Booking
const createBooking = catchAsync(async (req, res) => {
  const result = await BookingsServices.createBookingIntoDB(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Car booked successfully',
    data: result,
  });
});

// Confirm Booking
const confirmBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const result = await BookingsServices.confirmBooking(bookingId); // Ensure this service method exists
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking confirmed',
    data: result,
  });
});

// Cancel Booking
const cancelBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const result = await BookingsServices.cancelBooking(bookingId); // Ensure this service method exists
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

// Update Booking
const updateBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id; // Assuming the route uses :id
  const updatedData = req.body; // The updated data from the request
  const result = await BookingsServices.updateBookingIntoDB(bookingId, updatedData); // Ensure this service method exists
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking updated successfully',
    data: result,
  });
});

// Get All Bookings
const getAllBookings = catchAsync(async (req, res) => {
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
    message: 'Your bookings retrieved successfully',
    data: result,
  });
});

// Get Booking by ID
const getBookingsById = catchAsync(async (req, res) => {
  const bookingId = req.params.id; // Assuming the route uses :id
  const result = await BookingsServices.getBookingById(bookingId); // Ensure this service method exists
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

// Return Car
const returnCar = catchAsync(async (req, res) => {
  const { bookingId, endTime } = req.body;

  const result = await BookingsServices.returnCar(bookingId, endTime);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car returned successfully',
    data: result,
  });
});


// Change Booking Status (Approve or Cancel)
const changeBookingStatus = catchAsync(async (req, res) => {
  const { bookingId } = req.params; 
  const { status } = req.body;


  const result = await BookingsServices.changeBookingStatus(bookingId, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Booking ${status.toLowerCase()}d successfully`, // Dynamically use 'approved' or 'cancelled'
    data: result,
  });
});


// Exporting the Booking Controllers
export const BookingControllers = {
  createBooking,
  confirmBooking,
  cancelBooking,
  updateBooking, 
  getAllBookings,
  getMyBookings,
  getBookingsById,
  returnCar,
  changeBookingStatus 
};
