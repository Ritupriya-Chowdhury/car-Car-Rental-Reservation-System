import { z } from 'zod';

const featuredCarsZodSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
    price: z.string(),
    image:z.string().url("Image must be a valid URL")
  }),
});

export const FeaturedCarsZodSchema = {
    featuredCarsZodSchema
    
  };