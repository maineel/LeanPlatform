import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => { 
    try {
        console.log(process.env.MONGODB_URI, DB_NAME);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log("Connection Instance: ", connectionInstance);
        console.log(`MongoDB connected || DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection failed at db/index.js');
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;
