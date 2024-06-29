import { z } from 'zod';

const createCarZodSchema = z.object({
  body: z.object({
    carId: z.string(),
    date: z.string(),
    startTime: z.string(),
  }),
});


const returnCarZodSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string()
  }),
});

export const BookingZodSchema = {
  createCarZodSchema,
  returnCarZodSchema
};
