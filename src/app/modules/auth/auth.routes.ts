import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';


const router = express.Router();

router.post(
    '/signup',
     validateRequest(UserValidation.userValidationSchema), 
    AuthControllers.createUser
);

export const AuthRoutes=router;