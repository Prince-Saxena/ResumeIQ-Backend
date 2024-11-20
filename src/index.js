import { config } from "dotenv";
config();
import { app } from "./app.js";
import connectDB from "./DB/index.js";

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log(`Server listening at ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log("Mongoose connection failed!! ", error);
	});
