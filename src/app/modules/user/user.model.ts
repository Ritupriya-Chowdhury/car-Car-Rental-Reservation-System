import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

// Define the schema
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    status: {
      type: String,
      enum: ['activate', 'block'],
      default: 'activate',
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  }
  next();
});

// Remove password from the result after saving the user
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Add static methods for reset password functionality
userSchema.statics.setResetPasswordToken = async function (email: string, token: string) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
  await user.save();
};

userSchema.statics.verifyResetPasswordToken = async function (token: string) {
  const user = await this.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
  return user;
};

userSchema.statics.clearResetPasswordToken = async function (userId: string) {
  const user = await this.findById(userId);
  if (!user) throw new Error('User not found');

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
export interface TUserDocument extends TUser, Document {
  save(): Promise<TUserDocument>;
}

// Export the model
export const User = model<TUser, UserModel>('User', userSchema);
