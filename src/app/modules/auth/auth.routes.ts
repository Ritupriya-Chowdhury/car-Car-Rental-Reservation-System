import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthZodSchema } from './auth.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';


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

router.patch('/user/:id', 
auth(USER_ROLE.admin),
validateRequest(UserValidation.updateUserValidationSchema), 
AuthControllers.updateUserStatus);
router.patch('/user/:id',
auth(USER_ROLE.admin),
validateRequest(UserValidation.updateUserValidationSchema), 
 AuthControllers.updateUserRole);

 router.post(
    '/forget-password',
    validateRequest(AuthZodSchema.forgetPasswordSchema),
    AuthControllers.requestPasswordReset
);

router.post(
    '/reset-password',
    validateRequest(AuthZodSchema.resetPasswordSchema),
    AuthControllers.resetPassword
);

router.get(
    '/user/:id', 
    auth(USER_ROLE.user),  
    AuthControllers.findUserById  
  );
  

export const AuthRoutes=router;