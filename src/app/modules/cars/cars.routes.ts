import express from 'express';
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CarsControllers } from "./cars.controller";
import { USER_ROLE } from '../user/user.constant';
import { CarsZodSchema } from './cars.validation';



const router = express.Router();

// create car route
router.post(
  '',
  auth(USER_ROLE.admin),
  validateRequest(CarsZodSchema.createCarsZodSchema),
  CarsControllers. createCars
);


// Get single car route
router.get('/:id', CarsControllers.getSingleCar);

// get all cars route
router.get('', CarsControllers.getAllCars);

// update car route
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CarsZodSchema.updateCarsZodSchema),
  CarsControllers.updateCar
);

//delete car route
router.delete('/:id',auth(USER_ROLE.admin), CarsControllers.deleteCar);


export const CarsRoutes = router;