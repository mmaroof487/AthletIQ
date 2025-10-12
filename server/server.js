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

const frontendUrl = process.env.CLIENT_URL;

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

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fitness", authMiddleware, fitnessRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
