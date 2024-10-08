import { z } from 'zod';


// Define the Zod schema according to the TUser interface
const userValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
      .max(20, { message: 'Password can not more than 20 characters' }),
      confirmPassword: z
      .string({
        invalid_type_error: 'Password must be a string',
      }),
   
    address: z.string(),
    
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
   
   
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
   
      .max(20, { message: 'Password can not more than 20 characters' })
      .optional(),
      
    
  }),
  status: z.string().optional(),
  role: z.string().optional(),

});

// Export the schema
export const UserValidation = {
  userValidationSchema,
  updateUserValidationSchema
};
