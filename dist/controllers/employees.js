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
exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.getAllEmployees = void 0;
const employees_1 = __importDefault(require("../models/employees"));
const redisDb_1 = require("../config/redisDb");
const CACHE_TTL = 8; // Cache TTL in seconds
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employees_1.default.find();
        // Cache the data in Redis
        const client = yield (0, redisDb_1.redisConn)();
        const cacheKey = 'allEmployees';
        yield client.setex(cacheKey, CACHE_TTL, JSON.stringify(employees));
        yield client.quit();
        res.json({ code: 1, data: { employees } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
});
exports.getAllEmployees = getAllEmployees;
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, position, salary } = req.body;
    try {
        const newEmployee = new employees_1.default({ firstName, lastName, email, position, salary });
        const savedEmployee = yield newEmployee.save();
        res.json({ code: 1, data: { employee: savedEmployee } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
});
exports.createEmployee = createEmployee;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const employee = yield employees_1.default.findById(id);
        if (!employee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }
        res.json({ code: 1, data: { employee } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
});
exports.getEmployeeById = getEmployeeById;
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateFields = req.body;
    try {
        const existingEmployee = yield employees_1.default.findById(id);
        if (!existingEmployee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }
        // Apply updates to existingEmployee based on updateFields
        Object.assign(existingEmployee, updateFields);
        const updatedEmployee = yield existingEmployee.save();
        res.json({ code: 1, data: { employee: updatedEmployee } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedEmployee = yield employees_1.default.findByIdAndDelete(id);
        if (!deletedEmployee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }
        res.json({ code: 1, data: { employee: deletedEmployee } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
});
exports.deleteEmployee = deleteEmployee;
