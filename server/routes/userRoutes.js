import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getProfile);
router.post("/update/:userId", updateProfile);

export default router;
