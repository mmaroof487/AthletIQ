import express from "express";
import { addWeight, addCalories, getMeals } from "../controllers/fitnessController.js";

const router = express.Router();

// Always relative paths
router.post("/weight", addWeight);
router.post("/calories", addCalories);
router.get("/meals/:userId", getMeals);

export default router;
