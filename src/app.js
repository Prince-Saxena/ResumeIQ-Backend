import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { upload } from "./middleware/multer.middleware.js";

const app = e();

// List of allowed origins
const allowedOrigins = [
	"http://localhost:5173", // Frontend URL (React app)
	"http://127.0.0.1:5500", 
	"https://prince-saxena.github.io/ResumeIQ/#/",
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
		credentials: true, 
	})
);

app.use(e.json({ limit: "16kb" }));
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());



import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import summaryRouter from "./routes/suggestions.routes.js";

app.get("/favicon.ico", (req, res) => {
	res.status(204).end(); 
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/gen", summaryRouter);


export { app };
