import express from 'express';
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CarsControllers } from "./cars.controller";
import { USER_ROLE } from '../user/user.constant';
import { CarsZodSchema } from './cars.validation';



const router = express.Router();

// add room route
router.post(
  '',
  auth(USER_ROLE.admin),
  validateRequest(CarsZodSchema.createCarsZodSchema),
  CarsControllers. createCars
);


export const CarsRoutes = router;