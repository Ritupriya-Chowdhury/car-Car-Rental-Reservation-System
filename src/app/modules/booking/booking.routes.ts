import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { BookingZodSchema } from './booking.validation';
import { BookingControllers } from './booking.controller';


const router = express.Router();

router.post(
  '',
  auth(USER_ROLE.user,USER_ROLE.admin),
  validateRequest(BookingZodSchema.createCarZodSchema),
  BookingControllers.createBooking
);
router.put(
  '/:id',
  auth(USER_ROLE.user,USER_ROLE.admin),
  validateRequest(BookingZodSchema.updateCarZodSchema),
  BookingControllers.updateBooking
);

router.put(
  '/confirmation/:bookingId',
  auth(USER_ROLE.user,USER_ROLE.admin),

  BookingControllers.confirmBooking
);
router.put(
  '/booking-status/:bookingId',
  auth(USER_ROLE.admin),
  validateRequest(BookingZodSchema.approveOrCancelSchema),
  BookingControllers.changeBookingStatus
);
router.delete(
  'cancels/:bookingId',
  auth(USER_ROLE.user,USER_ROLE.admin),
  BookingControllers.cancelBooking
);
router.get(
  '',
  auth(USER_ROLE.admin),
   BookingControllers.getAllBookings
);
router.get(
  '/booking/:id',
  auth(USER_ROLE.admin,USER_ROLE.user),
   BookingControllers.getBookingsById
);
router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
   BookingControllers.getMyBookings
);




export const BookingRoutes = router;