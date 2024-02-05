// cacheMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { redisConn } from "../config/redisDb";

const CACHE_TTL = 8; // Cache TTL in seconds

export const cacheAllEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const client = await redisConn();
    const cacheKey = 'allEmployees';

    try {
        // Check if data is in the cache
        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            // Data found in the cache, send cached data as response
            const employees = JSON.parse(cachedData);
            res.json({ code: 1, data: { employees } });
        } else {
            // Data not in the cache, fetch from the database
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    } finally {
        await client.quit();
    }
};
