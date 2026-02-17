import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory explicitly
dotenv.config({ path: path.resolve(__dirname, ".env") });

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fitnessRoutes from "./routes/fitnessRoutes.js";

import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(
	cors({
		origin: ["https://athletiq-kbef.onrender.com", "http://localhost:5173", "http://localhost:5000"],
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fitness", authMiddleware, fitnessRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);

// Fallback route to serve index.html (SPA routing)
app.use((req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
