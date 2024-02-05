import express from 'express';
import * as employeeController from '../controllers/employees';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { cacheAllEmployees } from "../middlewares/redisCache"
const router = express.Router();

// Routes
router.get('/', cacheAllEmployees, employeeController.getAllEmployees);
router.post('/', isLoggedIn, employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', isLoggedIn, employeeController.updateEmployee);
router.delete('/:id', isLoggedIn, employeeController.deleteEmployee);

export default router;
