import { Request, Response, NextFunction } from 'express';

export const globalErrhandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // stack
    // message
    const stack = err?.stack;
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message = err?.message || 'Internal Server Error';
    res.status(statusCode).json({
        stack,
        message,
    });
};

// Define a custom error class
export class HttpError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new HttpError(404, `Route ${req.originalUrl} not found`);
    next(err);
};
