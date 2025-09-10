import express from "express";
import { getDashboard, getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/dashboard/:userId", getDashboard);
router.get("/profile/:userId", getProfile);
router.post("/update/:userId", updateProfile);

export default router;
