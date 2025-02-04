import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genSummary = async (req, res) => {
	try {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
		});
		// Validate API key
		if (!process.env.GEMINI_API_KEY) {
			throw new ApiError(500, "GEMINI_API_KEY is missing in environment variables.");
		}

		const { role, exp, additionalInfo } = req.body;

		if (!role || !exp || !additionalInfo) {
			throw new ApiError(400, "Missing required fields: role, exp, or additionalInfo.");
		}

		const prompt = `I am a ${role} with ${exp} of experience. ${additionalInfo}. Please provide three resume summaries for my profile: one for a Beginner, one for an Intermediate, and one for an Expert level. Each summary should be a separate paragraph labeled as Beginner, Intermediate, or Expert, detailing my skills and experience at each level. The response should be structured as a JavaScript object, with the keys "beginner", "intermediate", and "expert", each containing the corresponding summary as a string. The format should not include bullet points or lists, only the full paragraphs for each level.`;

		const result = await model.generateContent(prompt);

		// Inspect the response structure
		// console.log(result.response.text());

		// Extract the summaries
		const content = result.response.text().replace("```javascript\n", "").replace("```", "");

		if (!content) {
			throw new ApiError(500, "Unable to extract content from the response.");
		}

		res.status(200).json(new ApiResponse(200, content, "Successfully Generated!"));
	} catch (error) {
		console.error("Error generating summary:", error);
		res.status(error.status || 500).json(
			new ApiError(error.status || 500, error.message || "Internal Server Error")
		);
	}
};

export { genSummary };
