import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		username: {
			type: String,
			require: true,
			unique: true,
			lowcase: true,
			trim: true,
		},
		email: {
			type: String,
			require: true,
			unique: true,
			lowcase: true,
			trim: true,
		},
		fullname: {
			type: String,
			require: true,
			trim: true,
		},
		resume: [
			{
				type: Schema.Type.ObjectId,
				ref: "Resume",
			},
		],
		password: {
			type: String,
			require: [true, "Password is require!"],
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.genAccessToken = async function () {
	jwt.sign(
		{
			_id: this._id,
			username: this.username,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
