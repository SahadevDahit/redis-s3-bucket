"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.HttpError = exports.globalErrhandler = void 0;
const globalErrhandler = (err, req, res, next) => {
    // stack
    // message
    const stack = err === null || err === void 0 ? void 0 : err.stack;
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message = (err === null || err === void 0 ? void 0 : err.message) || 'Internal Server Error';
    res.status(statusCode).json({
        stack,
        message,
    });
};
exports.globalErrhandler = globalErrhandler;
// Define a custom error class
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.HttpError = HttpError;
// 404 handler
const notFound = (req, res, next) => {
    const err = new HttpError(404, `Route ${req.originalUrl} not found`);
    next(err);
};
exports.notFound = notFound;
