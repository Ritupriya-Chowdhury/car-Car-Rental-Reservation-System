import { Types } from "mongoose";

export type TCars = {
    _id?:Types.ObjectId;
    name: string;
    description: string;
    color: string;
    isElectric: boolean;
    features: string[];
    pricePerHour: number;
    status: 'available' | 'unavailable',
    isDeleted?: boolean;
    createdAt: Date,
    updatedAt: Date,

  };