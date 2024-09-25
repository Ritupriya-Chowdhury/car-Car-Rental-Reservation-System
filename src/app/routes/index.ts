import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CarsRoutes } from '../modules/cars/cars.routes';
import { BookingRoutes } from '../modules/booking/booking.routes';
import { FeaturedCarsRoutes } from '../modules/featuredCars/featuredCars.routes';




const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/cars',
    route: CarsRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/featured_cars',
    route: FeaturedCarsRoutes,
  },
  
 
 ]
 

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;