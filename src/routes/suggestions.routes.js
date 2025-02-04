import { Router } from "express";
import { genSummary } from "../controllers/sugesstions.controller.js";

const router = Router();

router.route("/summary").post(genSummary);

export default router;
