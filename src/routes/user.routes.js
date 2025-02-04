import { Router } from "express";
import {
	loginUser,
	logoutUser,
	registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route("/register").post(
	upload.fields([
		{
			name: "doc",
			maxcount: 1,
		},
	]),
	registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);


// router.route("/resume").post(
// 	upload.single("resumeFile"), // For handling a single resume file
// 	saveResume
// );

export default router;
