import Redis, { Redis as RedisClient } from "ioredis";
import dotenv from 'dotenv';
dotenv.config();

const redisConn = async (): Promise<RedisClient> => {
    const client = new Redis(`${process.env.redisConn}`);
    return client;
};

export { redisConn };
