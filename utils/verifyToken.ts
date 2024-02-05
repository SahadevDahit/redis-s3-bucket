import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): string | Boolean => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY || '') as string;
        return decoded;
    } catch (err) {
        // Handle verification errors
        return false;
    }
};
