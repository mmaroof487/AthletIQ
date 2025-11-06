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

app.use(
	cors({
		origin: ["https://athletiq-kbef.onrender.com", "http://localhost:5173"],
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fitness", authMiddleware, fitnessRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);

app.get("/", (req, res) => res.send("Server is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
