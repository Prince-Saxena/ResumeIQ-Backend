import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();
app.use(
	cors({
		origin: process.env.CORS_ORG,
		credentials: true,
	})
);

app.use(e.json({ limit: "16kb" }));
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/user", userRouter);

//http://localhost:8000/api/v1/user/register

export { app };
