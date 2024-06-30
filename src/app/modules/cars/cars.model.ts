import { Schema, Types, model } from 'mongoose';
import { TCars } from './cars.interface';

const carsSchema = new Schema<TCars>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
    },
    isElectric: {
      type: Boolean,
      required: [true, 'isElectric is required'],
    },
    features: {
      type: [String],
      required: [true, 'Features is required'],
    },
    pricePerHour: {
      type: Number,  // corrected from 'types' to 'type'
      required: [true, 'PricePerHour is required'],
    },
    status: {
      type: String,  // corrected from 'types' to 'type'
      default: 'available',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
carsSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carsSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Creating a custom static method
carsSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Cars.findOne({ id });
  return existingUser;
};

export const Cars = model<TCars>('Cars', carsSchema);
