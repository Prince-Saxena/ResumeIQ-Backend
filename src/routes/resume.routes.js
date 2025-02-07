import { Router } from "express";
import { uploadResume, getFiles ,deleteResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadResume);
router.get("/get-files", getFiles);
router.delete("/delete", deleteResume);

export default router;

