import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include userAuthId
interface AuthenticatedRequest extends Request {
    userAuthId?: string; // or the appropriate type for your user identifier
}

export const isLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token: string | null = getTokenFromHeader(req);
    const decodedUser: any | null = verifyToken(token as string);

    if (!decodedUser) {
        throw new Error("Invalid/Expired token, please login again");
    } else {
        // Save the user into req obj
        req.userAuthId = decodedUser?.id;
        next();
    }
};
