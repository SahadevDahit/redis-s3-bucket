"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromHeader = void 0;
const getTokenFromHeader = (req) => {
    var _a, _b;
    // Get token from header
    const token = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    // Check if token is undefined or null
    if (!token) {
        // Return null or throw an error, depending on your use case
        return null;
    }
    return token;
};
exports.getTokenFromHeader = getTokenFromHeader;
