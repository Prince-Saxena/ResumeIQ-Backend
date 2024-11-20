import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
		console.log(`Mongoose conected!!${connectionInstance.connection.host}`);
	} catch (error) {
		console.log("Connection Failed due to", error);
	}
};

export default connectDB;
