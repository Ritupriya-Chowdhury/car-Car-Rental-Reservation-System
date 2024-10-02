import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { BookingZodSchema } from './booking.validation';
import { BookingControllers } from './booking.controller';


const router = express.Router();

router.post(
  '',
  auth(USER_ROLE.user),
  validateRequest(BookingZodSchema.createCarZodSchema ),
   BookingControllers.createBooking
   
);
router.get(
  '',
  auth(USER_ROLE.admin),
   BookingControllers.getAllBookings
);
router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
   BookingControllers.getMyBookings
);




export const BookingRoutes = router;