import express from "express";
import { weight, calories, meals } from "../controllers/fitnessController.js";

const router = express.Router();

router.post("/weight", weight);
router.post("/calories", calories);
router.get("/meals/:userId", meals);
export default router;
