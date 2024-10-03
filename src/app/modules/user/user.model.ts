import bcrypt from 'bcrypt';
import { Schema, model, Document, Model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

// Define the user schema
const userSchema = new Schema<TUserDocument>(
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
      lowercase: true, 
      trim: true, 
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, 
    },
    confirmPassword: {
      type: String,
      required: [true, 'Password is required'],
      select: false, 
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
    resetPasswordToken: String, 
    resetPasswordExpires: Date,  
  },
  {
    timestamps: true,
  }
);

// Interface for user document
export interface TUserDocument extends TUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Hash password before saving the user
userSchema.pre<TUserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  }
  next();
});

// Ensure password is not returned
userSchema.post<TUserDocument>('save', function (doc, next) {
  doc.password = ''; // Ensure password is not returned
  next();
});

// Static method to check if user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string): Promise<TUserDocument | null> {
  return this.findOne({ email }).select('+password'); // Include password for validation
};

// Add static methods for reset password functionality
userSchema.statics.setResetPasswordToken = async function (email: string, token: string): Promise<void> {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
  await user.save();
};

userSchema.statics.verifyResetPasswordToken = async function (token: string): Promise<TUserDocument | null> {
  return this.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
};

userSchema.statics.clearResetPasswordToken = async function (userId: string): Promise<void> {
  const user = await this.findById(userId);
  if (!user) throw new Error('User not found');

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

// Static method to check if password matches
userSchema.statics.isPasswordMatched = async function (plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Export the model
export const User = model<TUserDocument, UserModel>('User', userSchema);
