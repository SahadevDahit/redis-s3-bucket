import mongoose, { Schema, Document } from 'mongoose';

// Define the Employee interface
interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    salary: number;
}

// Define the Employee schema
const EmployeeSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
});

// Create the Employee model
const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default EmployeeModel;
