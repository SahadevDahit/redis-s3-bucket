"use strict";
// cacheMiddleware.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheAllEmployees = void 0;
const redisDb_1 = require("../config/redisDb");
const CACHE_TTL = 8; // Cache TTL in seconds
const cacheAllEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, redisDb_1.redisConn)();
    const cacheKey = 'allEmployees';
    try {
        // Check if data is in the cache
        const cachedData = yield client.get(cacheKey);
        if (cachedData) {
            // Data found in the cache, send cached data as response
            const employees = JSON.parse(cachedData);
            res.json({ code: 1, data: { employees } });
        }
        else {
            // Data not in the cache, fetch from the database
            next();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
    finally {
        yield client.quit();
    }
});
exports.cacheAllEmployees = cacheAllEmployees;
