import client from "../config/db.js";

function calculateCalories(weight, height, age, gender, activityFactor = 1.2) {
	let bmr;
	if (gender === "male") {
		bmr = 10 * weight + 6.25 * height - 5 * age + 5;
	} else {
		bmr = 10 * weight + 6.25 * height - 5 * age - 161;
	}

	const calories = Math.round(bmr * activityFactor);
	return calories;
}

export const addWeight = async (req, res) => {
	const { userId, weight } = req.body;
	if (!userId || !weight || isNaN(weight)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		const date = new Date().toISOString().split("T")[0];
		const userResult = await client.query("SELECT id FROM member WHERE id = $1", [userId]);
		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		const existingResult = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);

		let startingWeight, weightChange, calorieIntake;
		const user = existingResult.rows[0];
		const height = user.height;
		const gender = user.gender;
		calorieIntake = calculateCalories(weight, height, gender);

		if (existingResult.rows.length === 0) {
			startingWeight = weight;
			weightChange = 0;

			const insertQuery = `
				INSERT INTO bodymeasurement (user_id, date, weight, startingweight, weightchange, calorieintake, height)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING *;
			`;

			const result = await client.query(insertQuery, [userId, date, weight, startingWeight, weightChange, calorieIntake, height]);

			return res.status(201).json(result.rows[0]);
		} else {
			const existing = existingResult.rows[0];
			startingWeight = existing.startingweight || existing.weight;
			weightChange = weight - startingWeight;

			const updateQuery = `
				UPDATE bodymeasurement
				SET date = $1, weight = $2, weightchange = $3, calorieintake = $4
				WHERE user_id = $5
				RETURNING *;
			`;

			const result = await client.query(updateQuery, [date, weight, weightChange, calorieIntake, userId]);
		}

		const historyWeight = await client.query("INSERT INTO weight_history (user_id, date, weight) VALUES ($1, $2, $3) RETURNING *", [userId, date, weight]);
		return res.status(200).json({
			message: "Weight updated successfully",
			current: { weight, weightChange, calorieIntake, startingWeight },
			historyEntry: historyWeight.rows[0],
		});
	} catch (err) {
		console.error("Error updating weight entry:", err);
		return res.status(500).json({ error: "Could not update weight" });
	}
};

export const addCalories = async (req, res) => {
	const { userId, calories, food } = req.body;

	if (!userId || !calories || !food || isNaN(calories)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		const date = new Date().toISOString().split("T")[0];
		const query = "INSERT INTO meals (user_id, date, calories, name) VALUES ($1, $2, $3, $4) RETURNING *";
		const result = await client.query(query, [userId, date, calories, food]);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error adding calorie entry:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMeals = async (req, res) => {
	const userId = req.params.userId;

	try {
		const date = new Date().toISOString().split("T")[0];
		const mealsQuery = `
            SELECT *
            FROM meals
            WHERE user_id = $1 AND date = $2
        `;
		const mealsResult = await client.query(mealsQuery, [userId, date]);

		if (mealsResult.rows.length === 0) {
			return res.status(404).json({ error: "No meals found for today" });
		}

		res.json({ meals: mealsResult.rows });
	} catch (err) {
		console.error("Error fetching meals:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
