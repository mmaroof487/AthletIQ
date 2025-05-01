import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Client } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.VITE_API_URL || "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

const client = new Client({
	user: process.env.DB_USER || "postgres",
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "AthletIQ",
	password: process.env.DB_PASSWORD || "ilu>c8cs",
	port: parseInt(process.env.DB_PORT || "5433", 10),
});

client
	.connect()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection failed:", err));

const createToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "supersecret", {
		expiresIn: "1h",
	});
};

app.post("/api/v1/register", async (req, res) => {
	const { email, password } = req.body;

	try {
		const existing = await client.query("SELECT * FROM member WHERE email = $1", [email]);
		if (existing.rows.length > 0) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await client.query("INSERT INTO member (email, password) VALUES ($1, $2) RETURNING *", [email, hashedPassword]);

		const token = createToken(result.rows[0]);
		res.status(201).json({ token, user: result.rows[0] });
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ message: "Registration failed" });
	}
});

app.post("/api/v1/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await client.query("SELECT * FROM member WHERE email = $1", [email]);

		if (result.rows.length === 0) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const user = result.rows[0];
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = createToken(user);
		res.status(200).json({ token, user });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Login failed" });
	}
});

app.get("/api/v1/dashboard/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		// Get body measurement data
		const bodyMeasurementQuery = "SELECT * FROM bodymeasurement WHERE user_id = $1";
		const bodyMeasurementResult = await client.query(bodyMeasurementQuery, [userId]);

		if (bodyMeasurementResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		// Get the current date (formatting may depend on your database, e.g., 'YYYY-MM-DD')
		const currentDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

		// Get meals data for the current date and user
		const mealsQuery = `
            SELECT SUM(calories) AS total_calories
            FROM meals
            WHERE user_id = $1 AND date = $2
        `;
		const mealsResult = await client.query(mealsQuery, [userId, currentDate]);

		const totalCalories = mealsResult.rows[0].total_calories || 0; // Default to 0 if no meals

		// Send the body measurement data along with total calories to the frontend
		res.json({
			bodyMeasurement: bodyMeasurementResult.rows[0],
			totalCalories: totalCalories,
		});
	} catch (err) {
		console.error("Error fetching user dashboard:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/api/v1/profile/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		const query = "SELECT * FROM member WHERE id = $1";
		const query1 = "SELECT * FROM bodymeasurement WHERE user_id = $1";

		const result = await client.query(query, [userId]);
		const result1 = await client.query(query1, [userId]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json([result.rows[0], result1.rows[0]]);
	} catch (err) {
		console.error("Error fetching user profile:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/v1/update/:userId", async (req, res) => {
	const { name, phone, address, birthday, height, weight, fitnessGoal, gender, imgurl, activityLevel = 1.55 } = req.body; // activityLevel default is moderate
	const userId = req.params.userId;

	try {
		if (!name) return res.status(400).json({ message: "Name is required." });

		const userQuery = `SELECT * FROM "member" WHERE id = $1`;
		const userResult = await client.query(userQuery, [userId]);
		if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found." });

		const birthDate = new Date(birthday);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

		let bmr;
		if (gender.toLowerCase() === "male") {
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else if (gender.toLowerCase() === "female") {
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		} else {
			bmr = 10 * weight + 6.25 * height - 5 * age - 120;
		}
		const calorieIntake = Math.round(bmr * activityLevel);

		const memberUpdateQuery = `
			UPDATE member
			SET name = $2, phone_number = $3, address = $4, birthday = $5, fitnessgoal = $6, age = $7, imageurl=$8
			WHERE id = $1;
		`;

		await client.query(memberUpdateQuery, [userId, name, phone, address, birthday, fitnessGoal, age, imgurl]);
		const oldDataQuery = `SELECT weight, weightchange FROM bodymeasurement WHERE user_id = $1`;
		const oldDataResult = await client.query(oldDataQuery, [userId]);

		let weightChange = 0;
		if (oldDataResult.rows.length > 0) {
			const oldWeight = parseFloat(oldDataResult.rows[0].weight);
			const existingChange = parseFloat(oldDataResult.rows[0].weightchange) || 0;
			const changeThisUpdate = weight - oldWeight;
			weightChange = existingChange + changeThisUpdate;
		} else {
			weightChange = 0; // No previous record
		}

		const bodyMeasurementQuery = `
	INSERT INTO bodymeasurement (user_id, weight, height, gender, calorieintake, weightchange)
	VALUES ($1, $2, $3, $4, $5, $6)
	ON CONFLICT (user_id)
	DO UPDATE SET
		weight = EXCLUDED.weight,
		height = EXCLUDED.height,
		gender = EXCLUDED.gender,
		calorieintake = EXCLUDED.calorieintake,
		weightchange = EXCLUDED.weightchange;
`;
		await client.query(bodyMeasurementQuery, [userId, weight, height, gender, calorieIntake, weightChange]);

		res.status(200).json({
			message: "Profile and body measurements updated successfully",
			user: {
				id: userId,
				name,
				phone,
				address,
				birthday,
				height,
				weight,
				age,
				calorieIntake,
				fitnessGoal,
				gender,
			},
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ message: "Failed to update profile", error: error.message });
	}
});

app.post("/api/v1/fitness/weight", async (req, res) => {
	const { userId, date, weight } = req.body;

	// Validate the input data
	if (!userId || !date || !weight || isNaN(weight)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		// Check if the user exists in the 'member' table (or appropriate user table)
		const userQuery = "SELECT * FROM member WHERE id = $1";
		const userResult = await client.query(userQuery, [userId]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		// Fetch the previous weight entry for the user
		const prevWeightQuery = "SELECT weight FROM bodymeasurement WHERE user_id = $1 ORDER BY date DESC LIMIT 1";
		const prevWeightResult = await client.query(prevWeightQuery, [userId]);

		let weightChange = 0;

		// If there is a previous weight, calculate the weight change
		if (prevWeightResult.rows.length > 0) {
			const previousWeight = prevWeightResult.rows[0].weight;
			weightChange = weight - previousWeight; // Calculate the weight change
		}

		// Check if there's already a record for the given user and date
		const checkRecordQuery = "SELECT * FROM bodymeasurement WHERE user_id = $1 AND date = $2";
		const checkRecordResult = await client.query(checkRecordQuery, [userId, date]);

		let result;
		if (checkRecordResult.rows.length > 0) {
			// Record exists, update it
			const updateQuery = `
				UPDATE bodymeasurement
				SET weight = $1, weightchange = $2
				WHERE user_id = $3 AND date = $4
				RETURNING *`;

			result = await client.query(updateQuery, [weight, weightChange, userId, date]);
		} else {
			// Record doesn't exist, insert a new one
			const insertQuery = `
				INSERT INTO bodymeasurement (user_id, date, weight, weight_change)
				VALUES ($1, $2, $3, $4)
				RETURNING *`;

			result = await client.query(insertQuery, [userId, date, weight, weightChange]);
		}

		return res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error updating weight entry:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/v1/fitness/calories", async (req, res) => {
	const { userId, date, calories, food } = req.body;

	if (!userId || !date || !calories || !food || isNaN(calories)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		const query = "INSERT INTO meals (user_id, date, calories, name) VALUES ($1, $2, $3, $4) RETURNING *";
		const result = await client.query(query, [userId, date, calories, food]);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error adding calorie entry:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/api/v1/meals/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		// Get today's date in 'YYYY-MM-DD' format
		const currentDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

		// Query to get all meals for the user on the current date
		const mealsQuery = `
            SELECT *
            FROM meals
            WHERE user_id = $1 AND date = $2
        `;
		const mealsResult = await client.query(mealsQuery, [userId, currentDate]);

		if (mealsResult.rows.length === 0) {
			return res.status(404).json({ error: "No meals found for today" });
		}

		// Return meals for today
		res.json({ meals: mealsResult.rows });
	} catch (err) {
		console.error("Error fetching meals:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
