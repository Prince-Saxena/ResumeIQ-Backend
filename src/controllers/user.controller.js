import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import  Resume  from "../models/resumePDF.model.js";

const generateAccessToken = async (userId) => {
	try {
		const user = await User.findById(userId);

		const accessToken = await user.genAccessToken();

		return accessToken;
	} catch (error) {
		throw new ApiError(500, "Something went wrong, while generating token!");
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const { fullname, username, email, password } = req.body;
	// console.log(fullname, username, email, password);
	if ([fullname, username, email, password].some((fields) => fields?.trim() === "")) {
		throw new ApiError(400, "All fields required!");
	}

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existedUser) {
		throw new ApiError(409, "User alredy existed please change Email or Username!");
	}

	const user = await User.create({
		fullname,
		username,
		email,
		password,
	});

	const checkUser = await User.findById(user._id).select("-password");

	if (!checkUser) throw new ApiError(500, "Something went wrong while registering User!");

	return res.status(201).json(new ApiResponse(200, checkUser, "User Register Successfully"));

	// res.status(200).json({
	// 	message: "OK",
	// });
});

const loginUser = asyncHandler(async (req, res) => {
	const { identifier, password } = req.body;

	if (!identifier) {
		throw new ApiError(400, "Username or Email is required!");
	}

	const user = await User.findOne({
		$or: [{ username: identifier }, { email: identifier }],
	});

	if (!user) throw new ApiError(404, "User not found!");

	const isPasswordCorrect = await user.isPasswordCorrect(password);

	if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Password!");

	const accessToken = await generateAccessToken(user._id);

	const loggedInUser = await User.findById(user._id).select("-password");

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		domain: "resume-iq-backend.vercel.app",
	};

	res.cookie("accessToken", accessToken, options);

	return res.status(200).json({
		message: "User Successfully logged in!",
		user: loggedInUser,
		accessToken,
	});
});

const logoutUser = asyncHandler(async (req, res) => {
	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.json(new ApiResponse(200, {}, "User logged out!"));
});

export { registerUser, loginUser, logoutUser };

// const uploadResume = async (req, res) => {
// 	try {
// 		// Check if file is uploaded
// 		if (!req.file) {
// 			return res.status(400).json({ message: "Please upload a PDF file" });
// 		}

// 		const blob = Date.now();
// 		// Create a new resume document
// 		const resume = new Resume({
// 			name: `req.file.originalname+${blob}`, // Store original file name
// 			fileData: req.file.buffer, // Store the file binary data
// 			uploadedAt: new Date(), // Store the upload timestamp
// 		});

// 		// Save resume in the database
// 		await resume.save();

// 		return res.status(201).json({
// 			message: "Resume uploaded successfully",
// 			resume: {
// 				id: resume._id,
// 				name: resume.name,
// 				uploadedAt: resume.uploadedAt,
// 			},
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({ message: "Error uploading resume", error });
// 	}
// };

