import { Request, Response } from 'express';
import UserModel from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisConn } from "../config/redisDb";

interface ApiResponse {
    code: number;
    data: any;
}

export const getUsers = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
        const users = await UserModel.find();
        res.json({
            code: 1,
            data: {
                ...users,
            },
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
};

export const getUserById = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id);
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
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
};

export const signIn = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { email, password } = req.body;
    const client = await redisConn();

    try {
        // Get the user's IP address
        const ipAddress = req.ip;
        // Check the number of attempts within the specified time frame
        const attemptsKey = `${ipAddress}`;
        const attemptsCount = await client.hget('loginAttempts', attemptsKey);

        if (attemptsCount && parseInt(attemptsCount) >= 10) {
            res.status(429).json({
                code: -1,
                data: {
                    error: 'Too many login attempts. Please try again later.',
                },
            });
            return;
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).json({
                code: -1,
                data: {
                    error: 'Invalid email or password',
                },
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment the login attempts counter in the Redis hash
            await client.hincrby('loginAttempts', attemptsKey, 1);

            // Set a TTL (time-to-live) for the hash (1 hour)
            await client.expire('loginAttempts', 3600);

            res.status(401).json({
                code: -1,
                data: {
                    error: 'Invalid email or password',
                },
            });
            return;
        }

        const token = jwt.sign({ userId: user._id }, `${process.env.JWT_KEY}`, { expiresIn: '8h' });

        res.json({
            code: 1,
            data: {
                message: 'Sign-in successful',
                token,
            },
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    } finally {
        // Close the Redis connection
        await client.quit();
    }
};

export const signUp = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { email, password, contact, role, status } = req.body;
    const client = await redisConn();
    await client.expire('signupAttempts', 60);

    // Get the user's IP address
    const ipAddress = req.ip;

    // Check the number of signup attempts within the specified time frame
    const attemptsKey = `${ipAddress}_signup`;
    try {
        const attemptsCount = await client.hget('signupAttempts', attemptsKey);

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

        const newUser = new UserModel({
            email,
            password,
            contact,
            role,
            status,
            profileImage, // Include the profileImage in the user data
        });

        const savedUser = await newUser.save();
        await client.hincrby('signupAttempts', attemptsKey, 1);
        res.status(201).json({
            code: 1,
            data: {
                savedUser,
            },
        });
    } catch (error: any) {
        console.error(error);

        // Increment the signup attempts counter in the Redis hash
        await client.hincrby('signupAttempts', attemptsKey, 1);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    } finally {

        // Set a TTL (time-to-live) for the hash (1 hour)
        await client.expire('loginAttempts', 3600);
        // Close the Redis connection
        await client.quit();
    }
};

export const updateUser = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { id } = req.params;
    const { email, contact, role, status } = req.body; // Making fields optional

    try {
        const user = await UserModel.findById(id);

        if (!user) {
            res.status(404).json({
                code: -1,
                data: {
                    error: 'User not found',
                },
            });
            return;
        }

        if (email) user.email = email;
        if (contact) user.contact = contact;
        if (role) user.role = role;
        if (status) user.status = status;


        const updatedUser = await user.save();

        res.json({
            code: 1,
            data: updatedUser
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
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
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            code: 0,
            data: {
                error: error.message,
            },
        });
    }
};
