import { Request, Response } from 'express';
import EmployeeModel from '../models/employees';
import { redisConn } from "../config/redisDb";
const CACHE_TTL = 8; // Cache TTL in seconds

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
        const employees = await EmployeeModel.find();

        // Cache the data in Redis
        const client = await redisConn();
        const cacheKey = 'allEmployees';
        await client.setex(cacheKey, CACHE_TTL, JSON.stringify(employees));
        await client.quit();

        res.json({ code: 1, data: { employees } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, position, salary } = req.body;

    try {
        const newEmployee = new EmployeeModel({ firstName, lastName, email, position, salary });
        const savedEmployee = await newEmployee.save();

        res.json({ code: 1, data: { employee: savedEmployee } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const employee = await EmployeeModel.findById(id);

        if (!employee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }

        res.json({ code: 1, data: { employee } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const existingEmployee = await EmployeeModel.findById(id);

        if (!existingEmployee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }

        // Apply updates to existingEmployee based on updateFields
        Object.assign(existingEmployee, updateFields);

        const updatedEmployee = await existingEmployee.save();

        res.json({ code: 1, data: { employee: updatedEmployee } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
};
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

        if (!deletedEmployee) {
            res.status(404).json({ code: 0, data: { error: 'Employee not found' } });
            return;
        }

        res.json({ code: 1, data: { employee: deletedEmployee } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, data: { error: 'Internal Server Error' } });
    }
};
