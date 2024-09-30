import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthZodSchema } from './auth.validation';


const router = express.Router();

router.post(
    '/signup',
     validateRequest(UserValidation.userValidationSchema), 
    AuthControllers.createUser
);

router.post(
    '/signin',
     validateRequest(AuthZodSchema.signInZodSchema), 
    AuthControllers.signInUser
);
router.post(
    '/refresh-token',
     validateRequest(AuthZodSchema.refreshTokenValidationSchema), 
    AuthControllers.refreshToken
);

export const AuthRoutes=router;