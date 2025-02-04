import cloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { nanoid } from "nanoid";

export const uploadResume = async (req, res) => {
	try {
		const filePath = req.file?.path;
		const userId = req.body.userId;
		const title = req.body.title;

		if (!filePath || !userId || !title) {
			return res.status(400).json(new ApiError(400, "File or UserID is required!"));
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json(new ApiError(404, "User not found!"));
		}

		const publicId = nanoid(8);
		let uploadResult;
		try {
			uploadResult = await cloudinary.uploader.upload(filePath, {
				public_id: publicId,
				resource_type: "raw",
			});
		} catch (uploadError) {
			console.error("Error uploading to Cloudinary:", uploadError);
			return res.status(500).json(new ApiError(500, "Error uploading file to Cloudinary!"));
		}

		user.resume.push({ publicId, title });
		await user.save();

		return res.status(200).json(new ApiResponse(200, {}, "File uploaded successfully."));
	} catch (error) {
		console.error("Upload error:", error);
		return res
			.status(500)
			.json(new ApiError(500, `Error occurred during upload: ${error.message}`));
	}
};

export const getFiles = async (req, res) => {
	try {
		const userId = req.query.userId;

		if (!userId) {
			return res.status(400).json(new ApiError(400, "UserID is required!"));
		}

		const user = await User.findById(userId).select("resume");

		if (!user) {
			return res.status(404).json(new ApiError(404, "User not found!"));
		}
		// console.log(user.resume);

		return res.status(200).json(new ApiResponse(200, { publicIdArray: user.resume }));
	} catch (error) {
		console.error("Error retrieving files:", error);
		return res.status(500).json(new ApiError(500, `Error retrieving files: ${error.message}`));
	}
};

export const deleteResume = async (req, res) => {
	const { publicId, userId } = req.query;

	const Id = `${String(publicId)}.pdf`;
	if (!publicId || !userId) {
		return res.status(400).json(new ApiError(400, "publicId and userId are required!"));
	}
	// console.log(Id);

	try {
		// Step 1: Delete the file from Cloudinary
		const options = {
			resource_type: "raw", // Specify the resource type (e.g., image, raw, video)
			invalidate: true, // Invalidate cached versions of the asset
		};

		const result = await cloudinary.uploader.destroy(Id, options);

		if (result.result !== "ok") {
			return res.status(500).json(new ApiError(500, "Error deleting file from Cloudinary"));
		}

		// Step 2: Remove the resume ID from the user's resume array
		const user = await User.findById(userId).select("resume fullname username");

		if (!user) {
			console.log("User not found!");
		} else {
			// Filter out the resume with the matching publicId
			user.resume = user.resume.filter((item) => item.publicId !== publicId);

			// Save the updated user document
			await user.save();
		}
		if (!user) {
			return res.status(404).json(new ApiError(404, "User not found!"));
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ user, cloudinaryResult: result },
					"File deleted successfully and resume ID removed from user."
				)
			);
	} catch (error) {
		console.error("Error deleting file or updating user:", error);
		return res.status(500).json(new ApiError(500, `Error occurred: ${error.message}`));
	}
};
