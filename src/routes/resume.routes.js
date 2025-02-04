import { Router } from "express";
import { uploadResume, getFiles ,deleteResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadResume);
router.get("/get-files", getFiles);
router.delete("/delete", deleteResume);

export default router;

// import { Router } from "express";
// import cloudinary from "../utils/cloudinary.js";
// import { User } from "../models/user.model.js";
// import { nanoid } from "nanoid";
// import mongoose from "mongoose";
// import { upload } from "../middleware/multer.middleware.js";

// const router = Router();

// // router.post("/upload", upload.single("file"), async function (req, res) {
// // 	try {
// // 		const filePath = req.file?.path;
// // 		if (!filePath) {
// // 			return res.status(400).json({ message: "File path not found!" });
// // 		}
// // 		console.log(req.userId);
// // 		if (!mongoose.Types.ObjectId.isValid(req.userId)) {
// // 			return res.status(400).json({ message: "Invalid user ID format!" });
// // 		}

// // 		const user = await User.findById(req.userId);
// // 		if (!user) {
// // 			return res.status(404).json({ message: "User not found!" });
// // 		}
// // 		if (user) {
// // 			const publicId = nanoid(8);
// // 			const response = await cloudinary.uploader.upload(filePath, {
// // 				public_id: publicId,
// // 				resource_type: "auto",
// // 			});
// // 		}
// // 		user.resume.push(publicId); // Correctly push the variable, not a string
// // 		await user.save();

// // 		// fs.unlinkSync(filePath);
// // 		return res.json({ message: "File uploaded successfully!", status: 200 });
// // 	} catch (error) {
// // 		// fs.unlinkSync(filePath);
// // 		console.log("Somthing went wrong during file upload !", error);
// // 		return null;
// // 	}
// // });

// // router.post("/upload", attachUserId, upload.single("file"), async function (req, res) {
// // 	try {
// // 		const filePath = req.file?.path;
// // 		if (!filePath) {
// // 			return res.status(400).json({ message: "File path not found!" });
// // 		}

// // 		if (!mongoose.Types.ObjectId.isValid(req.userId)) {
// // 			return res.status(400).json({ message: "Invalid user ID format!" });
// // 		}

// // 		const user = await User.findById(req.userId);
// // 		if (!user) {
// // 			return res.status(404).json({ message: "User not found!" });
// // 		}

// // 		const publicId = nanoid(8);
// // 		const response = await cloudinary.uploader.upload(filePath, {
// // 			public_id: publicId,
// // 			resource_type: "auto",
// // 		});

// // 		user.resume.push(publicId);
// // 		await user.save();

// // 		return res.json({ message: "File uploaded successfully!", status: 200 });
// // 	} catch (error) {
// // 		console.error("Something went wrong during file upload!", error);
// // 		return res.status(500).json({ message: "Internal Server Error" });
// // 	}
// // });
// // router.post("/upload", upload.single("file"), async function (req, res) {
// // 	try {
// // 		const filePath = req.file?.path;
// // 		const userId = req.body.userId;
// // 		console.log(userId);

// // 		if (!filePath || !userId) {
// // 			return res.status(400).json({ message: "File or user ID not found!" });
// // 		}

// // 		// if (!mongoose.Types.ObjectId.isValid(userId)) {
// // 		// 	return res.status(400).json({ message: "Invalid user ID format!" });
// // 		// }

// // 		const user = await User.findById(userId);
// // 		if (!user) {
// // 			return res.status(404).json({ message: "User not found!" });
// // 		}

// // 		const publicId = nanoid(8);
// // 		const response = await cloudinary.uploader.upload(filePath, {
// // 			public_id: publicId,
// // 			resource_type: "raw",
// // 		});

// // 		user.resume.push(publicId); // Correctly push the variable, not a string
// // 		await user.save();

// // 		return res.json({ message: "File uploaded successfully!", status: 200 });
// // 	} catch (error) {
// // 		console.log("Something went wrong during file upload!", error);
// // 		return res.status(500).json({ message: "An error occurred during upload." + error });
// // 	}
// // });

// router.post("/upload", upload.single("file"), async function (req, res) {
// 	try {
// 		const filePath = req.file?.path;
// 		const userId = req.body.userId;

// 		if (!filePath || !userId) {
// 			return res.status(400).json({ message: "File or user ID not provided." });
// 		}

// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found." });
// 		}

// 		const publicId = nanoid(8);
// 		const response = await cloudinary.uploader.upload(filePath, {
// 			public_id: publicId,
// 			resource_type: "raw",
// 		});

// 		user.resume.push(publicId);
// 		await user.save();

// 		return res.status(200).json({ message: "File uploaded successfully." });
// 	} catch (error) {
// 		console.error("Upload error:", error);
// 		res.status(500).json({ message: `Error occurred during upload: ${error.message}` });
// 	}
// });

// router.get("/get-files", async (req, res) => {
// 	const userId = req.query.userId;
// 	console.log(userId, "LL");

// 	if (!userId) {
// 		return res.status(400).json({ error: "No UserId provided" });
// 	}

// 	const publicIds = await User.findById(userId).select(
// 		"-password -fullname -email -username -_id -createdAt -updatedAt -__v"
// 	);
// 	console.log(publicIds);

// 	if (!publicIds) {
// 		return res.status(400).json({ error: "No publicIds provided" });
// 	}

// 	const publicIdArray = publicIds.resume;

// 	try {
// 		// const files = await Promise.all(
// 		// 	publicIdArray.map(async (publicId) => {
// 		// 		const result = await cloudinary.api.resource(`${publicId}.pdf`);
// 		// 		return {
// 		// 			publicId: result.public_id,
// 		// 			url: result.secure_url,
// 		// 			format: result.format,
// 		// 			width: result.width,
// 		// 			height: result.height,
// 		// 		};
// 		// 	})
// 		// );

// 		// Return the array of file data
// 		// res.json({ files });
// 		return res.status(200).json({ publicIdArray });
// 	} catch (error) {
// 		console.error("Error retrieving files", error);
// 		res.status(500).json({ error: "Error retrieving files" });
// 	}
// });

// export default router;
