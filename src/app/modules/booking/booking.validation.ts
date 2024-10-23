import { z } from 'zod';

const createCarZodSchema = z.object({
  body: z.object({
    carId: z.string(),
    date: z.string(),
    startTime: z.string(),
    nidOrPassport: z.string(),
    drivingLicense: z.string(),
    paymentDetails: z.object({
      cardNumber: z.string(),
      expiry: z.string(),
      cvv: z.string(),
    }),
    additionalOptions: z.object({
      gps: z.boolean().optional(),
      childSeat: z.boolean().optional(),
    }).optional(),
  }),
});
const updateCarZodSchema = z.object({
  body: z.object({
    carId: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    nidOrPassport: z.string().optional(),
    drivingLicense: z.string().optional(),
    paymentDetails: z.object({
      cardNumber: z.string(),
      expiry: z.string(),
      cvv: z.string(),
    }).optional(),
    additionalOptions: z.object({
      gps: z.boolean().optional(),
      childSeat: z.boolean().optional(),
    }).optional(),
  }),
});



const returnCarZodSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string()
  }),
});
const paymentZodSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    paymentStatus: z.string()
  }),
});
const confirmBookingSchema = z.object({
  body: z.object({
    confirmation:z.boolean()
   
  }),
});
const approveOrCancelSchema = z.object({
  body: z.object({
    status:z.string()
   
  }),
});



export const BookingZodSchema = {
  createCarZodSchema,
  returnCarZodSchema,
  paymentZodSchema,
  confirmBookingSchema,
  updateCarZodSchema,
  approveOrCancelSchema

};
