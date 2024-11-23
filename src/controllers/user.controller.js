import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
	const { fullname, username, email, password } = req.body;
	// console.log(fullname, username, email, password);
	if ([fullname, username, email, password].some((fields) => fields?.trim() === "")) {
		throw new ApiError(400, "All fields required!");
	}

	const existedUser = User.findOne({
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

	if(!checkUser) throw new ApiError(500,"Something went wrong while registering User!");

	return res.send(201).json(
		new ApiResponse(200,checkUser,"User Register Successfully")
	)

	// res.status(200).json({
	// 	message: "OK",
	// });
});

export { registerUser };
