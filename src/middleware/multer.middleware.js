import path from "path";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
	// destination: function (req, file, cb) {
	// 	cb(null, "\public\Temp"); // Use the corrected tempDir
	// },
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

export const upload = multer({ storage: storage });
