import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CarsControllers } from './cars.controller';
import { USER_ROLE } from '../user/user.constant';
import { CarsZodSchema } from './cars.validation';
import { BookingZodSchema } from '../booking/booking.validation';
import { BookingControllers } from '../booking/booking.controller';

const router = express.Router();

// create car route
router.post(
  '/create-car',
  auth(USER_ROLE.admin),
  validateRequest(CarsZodSchema.createCarsZodSchema),
  CarsControllers.createCars,
);

// Get single car route
router.get('/:id', CarsControllers.getSingleCar);

// get all cars route
router.get('', CarsControllers.getAllCars);

// return car route
router.put(
  '/return',
  auth(USER_ROLE.admin),
  validateRequest(BookingZodSchema.returnCarZodSchema),
  BookingControllers.returnCar,
);
// Customer review
router.patch(
  '/customer-review/:id',
  auth(USER_ROLE.user),
  validateRequest(CarsZodSchema.addCustomerReview),
  CarsControllers. addCustomerReview,
);

//delete car route
router.delete('/:id', auth(USER_ROLE.admin), CarsControllers.deleteCar);

// update car route
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CarsZodSchema.updateCarsZodSchema),
  CarsControllers.updateCar,
);

router.get('/availability', CarsControllers.checkCarAvailability);

export const CarsRoutes = router;
