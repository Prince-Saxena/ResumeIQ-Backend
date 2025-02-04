import path from "path";
import fs from "fs";
import multer from "multer";

// Derive __dirname using import.meta.url
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// // Correct the path to avoid leading backslashes
// const tempDir = path.resolve(__dirname, "..", "..", "..", "Backend", "public", "temp");

// // Ensure the directory exists
// if (!fs.existsSync(tempDir)) {
// 	fs.mkdirSync(tempDir, { recursive: true });
// }

const storage = multer.diskStorage({
	// destination: function (req, file, cb) {
	// 	cb(null, "\public\Temp"); // Use the corrected tempDir
	// },
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

export const upload = multer({ storage: storage });
