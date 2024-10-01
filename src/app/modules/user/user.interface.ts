import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id: any;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  phone: string;
  address: string;
  status: 'activate'| 'block';
  createdAt:Date;
  updatedAt:Date;
  resetPasswordToken?: string; 
  resetPasswordExpires?: Date; 

}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  setResetPasswordToken(email: string, token: string): Promise<void>; 
  verifyResetPasswordToken(token: string): Promise<TUser | null>; 
  clearResetPasswordToken(userId: string): Promise<void>; 
}

export type TUserRole = keyof typeof USER_ROLE;