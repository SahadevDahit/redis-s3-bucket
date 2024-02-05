
import mongoose from "mongoose";

const dbConn = async () => {
    try {
        mongoose.set("strictQuery", false);
        const connected = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`Mongodb connected ${connected.connection.host}`);
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
export default dbConn;