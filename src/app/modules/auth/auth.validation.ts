import { z } from "zod";

// Schema for signing in
const signInZodSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }),
        password: z.string({ required_error: 'Password is required' }),
    })
});

// Schema for refreshing the token
const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!'
        })
    })
});

// Schema for forgetting password
const forgetPasswordSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }),
    }),
});

// Schema for resetting password
const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string({ required_error: 'Token is required' }),
        newPassword: z.string().min(6, 'Password must be at least 6 characters').nonempty('New password is required'),
    }),
});

// Exporting all schemas together
export const AuthZodSchema = {
    signInZodSchema,
    refreshTokenValidationSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
};
