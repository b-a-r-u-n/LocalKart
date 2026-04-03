import mongoose from "mongoose";
import { dbName } from "../constant.js";

const connectDB = async () => {
    
    try {
        const connectionInfo = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log(`MongoDB connected: ${connectionInfo.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }   
}

export default connectDB;