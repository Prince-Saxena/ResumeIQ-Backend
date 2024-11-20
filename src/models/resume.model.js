import mongoose, { Schema } from "mongoose";

const workExperienceSchema = new Schema({
	position: { type: String, required: true },
	company: { type: String, required: true },
	start: { type: String, required: true },
	end: { type: String, required: true },
	responsibilities: { type: String, required: true },
});

const educationSchema = new Schema({
	degree: { type: String, required: true },
	major: { type: String, required: true },
	institution: { type: String, required: true },
	start: { type: String, required: true },
	end: { type: String, required: true },
	location: { type: String, required: true },
});

const projectSchema = new Schema({
	title: { type: String, required: true },
	role: { type: String, required: true },
	technologies: [{ type: String, required: true }],
	link: { type: String },
	description: { type: String, required: true },
});

const skillSchema = new Schema({
	category: { type: String, required: true },
	skills: [{ type: String, required: true }],
});

const resumeSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User", 
			required: true,
		},
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		title: { type: String, required: true },
		email: { type: String, required: true },
		pincode: { type: String, required: true },
		phone: { type: String, required: true },
		address: { type: String, required: true },
		summary: { type: String, required: true },
		workExperience: [workExperienceSchema],
		education: [educationSchema], 
		projects: [projectSchema], 
		skillsData: [skillSchema], 
		certifications: [{ type: String }], 
	},
	{ timestamps: true } 
);

export const Resume = mongoose.model("Resume", resumeSchema);
