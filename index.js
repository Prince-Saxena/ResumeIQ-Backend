import { config } from "dotenv";
config();
import { app } from "./src/app.js";
import connectDB from "./src/DB/index.js";

app.get("/", (req, res) => {
	res.send("Hello");
});

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log(`Server listening at ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log("Mongoose connection failed!! ", error);
	});
