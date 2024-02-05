"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const getTokenFromHeader_js_1 = require("../utils/getTokenFromHeader.js");
const verifyToken_js_1 = require("../utils/verifyToken.js");
const isLoggedIn = (req, res, next) => {
    const token = (0, getTokenFromHeader_js_1.getTokenFromHeader)(req);
    const decodedUser = (0, verifyToken_js_1.verifyToken)(token);
    if (!decodedUser) {
        throw new Error("Invalid/Expired token, please login again");
    }
    else {
        // Save the user into req obj
        req.userAuthId = decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.id;
        next();
    }
};
exports.isLoggedIn = isLoggedIn;
