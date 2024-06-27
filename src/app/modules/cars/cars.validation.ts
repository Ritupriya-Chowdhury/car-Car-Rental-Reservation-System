import { z } from 'zod';

 const createCarsZodSchema = z.object({
  body: z.object({
    name: z.string(),
   description: z.string(),
   color:z.string(),
   isElectric: z.boolean(),
   features:z.array(z.string()),
    pricePerHour:z.number(),
    isDeleted: z.boolean().optional(),
  }),
});




export const CarsZodSchema = {
    createCarsZodSchema
  
  }