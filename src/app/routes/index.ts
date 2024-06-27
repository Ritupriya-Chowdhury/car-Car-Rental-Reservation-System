import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
//   {
//     path: '/rooms',
//     route: MeetingRoomRoutes,
//   },
//   {
//     path: '/slots',
//     route: SlotRoutes,
//   },
//   {
//     path: '/',
//     route: BookingRoutes,
//   },
  
 
 ]
 

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;