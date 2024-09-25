import { z } from 'zod';

const createCarsZodSchema = z.object({
  body: z.object({
    name: z.string(),
    image: z.string(),
    description: z.string(),
    color: z.string(),
    isElectric: z.boolean(),
    features: z.array(z.string()),
    pricePerHour: z.number(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    isDeleted: z.boolean().optional(),
  }),
});

const updateCarsZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    isElectric: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number().optional(),
    status: z.enum(['available', 'unavailable']).optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CarsZodSchema = {
  createCarsZodSchema,
  updateCarsZodSchema,
};
