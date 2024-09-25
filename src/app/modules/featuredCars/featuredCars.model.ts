import { Schema, model } from 'mongoose';
import { TFeaturedCars } from './featuredCars.interface';

const featuredCarsSchema = new Schema<TFeaturedCars>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    price:{ type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export const FeaturedCars = model<TFeaturedCars>('FeaturedCars', featuredCarsSchema);