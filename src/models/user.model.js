import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
		},
		resume: [
			{
				title: { type: String, trim: true,required:true },
				publicId: { type: String, required: true, trim: true },
			},
		],
		password: {
			type: String,
			required: [true, "Password is required!"],
		},
	},
	{ timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) return next();
		this.password = await bcrypt.hash(this.password, 10);
		next();
	} catch (err) {
		next(err);
	}
});

// Method to verify password
userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.genAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
			fullname: this.fullname,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
