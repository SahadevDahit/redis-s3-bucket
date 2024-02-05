import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUsers extends Document {
    profileImage: string | null;
    email: string;
    password: string;
    contact: string;
    role: string;
    status: boolean;
}

const usersSchema: Schema = new Schema({
    profileImage: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    contact: { type: String, required: true, minlength: 10 },
    role: { type: String, default: 'user' },
    status: { type: Boolean, default: true },
});
usersSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password as string, salt); // Explicitly assert the type
        this.password = hashedPassword;
        next();
    } catch (err) {
        console.log(err);
    }
});

const users = mongoose.model<IUsers>('users', usersSchema);

export default users;