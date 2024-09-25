import { Schema, Types, model } from 'mongoose';
import { TCars } from './cars.interface';

const carsSchema = new Schema<TCars>(
  
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
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
      type: Number,  
      required: [true, 'PricePerHour is required'],
    },
    status: {
      type: String,  
      default: 'available',
    },
    location: {
      type: String,  
     default: 'Chattogram'
    },
    startDate: {
      type: String,  
   
    },
   endDate: {
      type: String,  
   
    },
    carType: { 
      type: String, 
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


carsSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Cars.findOne({ id });
  return existingUser;
};

export const Cars = model<TCars>('Cars', carsSchema);
