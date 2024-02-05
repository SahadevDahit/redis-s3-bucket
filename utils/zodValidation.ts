import { z, ZodError } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    contact: z.string().min(10),
    role: z.string().optional(),
    status: z.boolean().optional(),
});

export type UserInput = z.infer<typeof userSchema>;

export const validateUserInput = (data: unknown): UserInput => {
    try {
        return userSchema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            // Handle validation errors (e.g., log, throw a specific error, etc.)
            throw new Error(`Validation error: ${error.errors}`);
        }
        throw error; // Re-throw other types of errors
    }
};