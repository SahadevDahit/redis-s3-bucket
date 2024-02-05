"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.signUp = exports.signIn = exports.getUserById = exports.getUsers = void 0;
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisDb_1 = require("../config/redisDb");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.default.find();
        res.json({
            code: 1,
            data: Object.assign({}, users),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield users_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                code: -1,
                data: {
                    error: 'User not found',
                },
            });
            return;
        }
        res.json({
            code: 1,
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
});
exports.getUserById = getUserById;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const client = yield (0, redisDb_1.redisConn)();
    try {
        // Get the user's IP address
        const ipAddress = req.ip;
        // Check the number of attempts within the specified time frame
        const attemptsKey = `${ipAddress}`;
        const attemptsCount = yield client.hget('loginAttempts', attemptsKey);
        if (attemptsCount && parseInt(attemptsCount) >= 10) {
            res.status(429).json({
                code: -1,
                data: {
                    error: 'Too many login attempts. Please try again later.',
                },
            });
            return;
        }
        const user = yield users_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({
                code: -1,
                data: {
                    error: 'Invalid email or password',
                },
            });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment the login attempts counter in the Redis hash
            yield client.hincrby('loginAttempts', attemptsKey, 1);
            // Set a TTL (time-to-live) for the hash (1 hour)
            yield client.expire('loginAttempts', 3600);
            res.status(401).json({
                code: -1,
                data: {
                    error: 'Invalid email or password',
                },
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, `${process.env.JWT_KEY}`, { expiresIn: '8h' });
        res.json({
            code: 1,
            data: {
                message: 'Sign-in successful',
                token,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
    finally {
        // Close the Redis connection
        yield client.quit();
    }
});
exports.signIn = signIn;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, contact, role, status } = req.body;
    const client = yield (0, redisDb_1.redisConn)();
    yield client.expire('signupAttempts', 60);
    // Get the user's IP address
    const ipAddress = req.ip;
    // Check the number of signup attempts within the specified time frame
    const attemptsKey = `${ipAddress}_signup`;
    try {
        const attemptsCount = yield client.hget('signupAttempts', attemptsKey);
        if (attemptsCount && parseInt(attemptsCount) >= 15) {
            res.status(429).json({
                code: -1,
                data: {
                    error: 'Too many sign-up attempts. Please try again later.',
                },
            });
            return;
        }
        // Use the fileUrl from res.locals if available (set by uploadToS3 middleware)
        const profileImage = res.locals.fileUrl;
        const newUser = new users_1.default({
            email,
            password,
            contact,
            role,
            status,
            profileImage, // Include the profileImage in the user data
        });
        const savedUser = yield newUser.save();
        yield client.hincrby('signupAttempts', attemptsKey, 1);
        res.status(201).json({
            code: 1,
            data: {
                savedUser,
            },
        });
    }
    catch (error) {
        console.error(error);
        // Increment the signup attempts counter in the Redis hash
        yield client.hincrby('signupAttempts', attemptsKey, 1);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
    finally {
        // Set a TTL (time-to-live) for the hash (1 hour)
        yield client.expire('loginAttempts', 3600);
        // Close the Redis connection
        yield client.quit();
    }
});
exports.signUp = signUp;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, contact, role, status } = req.body; // Making fields optional
    try {
        const user = yield users_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                code: -1,
                data: {
                    error: 'User not found',
                },
            });
            return;
        }
        if (email)
            user.email = email;
        if (contact)
            user.contact = contact;
        if (role)
            user.role = role;
        if (status)
            user.status = status;
        const updatedUser = yield user.save();
        res.json({
            code: 1,
            data: updatedUser
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield users_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({
                code: -1,
                data: {
                    error: 'User not found',
                },
            });
            return;
        }
        res.status(200).json({
            code: 1,
            data: deletedUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
});
exports.deleteUser = deleteUser;
