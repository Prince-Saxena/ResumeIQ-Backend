import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { upload } from "./middleware/multer.middleware.js";

const app = e();

// List of allowed origins
const allowedOrigins = [
	"http://localhost:5173", // Frontend URL (React app)
	"http://127.0.0.1:5500", // Another possible frontend URL
	"https://your-production-domain.com", // Add your production domain
	"https://prince-saxena.github.io/Test/#/",
];

// CORS configuration to allow multiple origins
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (mobile apps, Postman, etc.)
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("CORS not allowed"), false);
			}
		},
		credentials: true, // Allow cookies to be sent
	})
);

app.use(e.json({ limit: "16kb" }));
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import summaryRouter from "./routes/suggestions.routes.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/gen", summaryRouter);

// app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
// 	try {
// 		if (!req.file) {
// 			return res.status(400).json({ message: "No file uploaded" });
// 		}

// 		// Call Cloudinary upload
// 		const response = await uploadOnCloudinary(req.file.path);

// 		// Clean up the uploaded file after uploading to Cloudinary
// 		fs.unlink(req.file.path, (err) => {
// 			if (err) console.error("Error deleting file:", err);
// 		});

// 		if (response) {
// 			res.status(200).json({ message: "File uploaded successfully", data: response });
// 		} else {
// 			res.status(500).json({ message: "Error uploading file to Cloudinary" });
// 		}
// 	} catch (error) {
// 		res.status(500).json({ message: "Error during file upload", error });
// 	}
// });

export { app };
