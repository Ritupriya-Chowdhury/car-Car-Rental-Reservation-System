import express from 'express';
import { FeaturedCarsZodSchema } from './featuredCars.validation';
import validateRequest from '../../middlewares/validateRequest';
import { FeaturedCarsControllers } from './featuredCars.controller';


const router = express.Router();

// create car route
router.post(
    '',
    validateRequest(FeaturedCarsZodSchema.featuredCarsZodSchema),
    FeaturedCarsControllers. createFeaturedCars
  );
  
  
  // Get all featured car route
  router.get('/',  FeaturedCarsControllers.getAllFeaturedCar);

  export const FeaturedCarsRoutes = router;