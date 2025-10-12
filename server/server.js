import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fitnessRoutes from "./routes/fitnessRoutes.js";

import authMiddleware from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();

// Frontend URL for CORS
const frontendUrl = process.env.CLIENT_URL || "https://athletiq-4gix.onrender.com";

app.use(
	cors({
		origin: frontendUrl,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

app.options(
	"*",
	cors({
		origin: frontendUrl,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ All routes are relative paths
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fitness", authMiddleware, fitnessRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);

// Health check
app.get("/", (req, res) => res.send("Server is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
