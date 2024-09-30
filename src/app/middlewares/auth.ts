import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
let decoded;
   if (!authHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route!');
    }

    const token = authHeader;
    try{
       decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

    }catch(err){
      throw new AppError(httpStatus.UNAUTHORIZED,'Unauthorized')
    }
   

    const { email, role } = decoded;
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'No Data Found!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route!');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
