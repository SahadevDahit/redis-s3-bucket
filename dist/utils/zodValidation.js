"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInput = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    contact: zod_1.z.string().min(10),
    role: zod_1.z.string().optional(),
    status: zod_1.z.boolean().optional(),
});
const validateUserInput = (data) => {
    try {
        return userSchema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // Handle validation errors (e.g., log, throw a specific error, etc.)
            throw new Error(`Validation error: ${error.errors}`);
        }
        throw error; // Re-throw other types of errors
    }
};
exports.validateUserInput = validateUserInput;
