import client from "../db/client.js";

export const weight = async (req, res) => {
	const { userId, weight, height, gender, calorieIntake } = req.body;

	if (!userId || !weight || isNaN(weight)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		// Get the previous weight for weight change calculation
		const prevQuery = "SELECT weight FROM bodymeasurement WHERE user_id = $1";
		const prevResult = await client.query(prevQuery, [userId]);

		let weightChange = 0;
		if (prevResult.rows.length > 0) {
			const previousWeight = prevResult.rows[0].weight;
			weightChange = weight - previousWeight;
		}

		// Upsert (insert or update on conflict)
		const query = `
      INSERT INTO bodymeasurement (user_id, weight, height, gender, calorieintake, weightchange)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        gender = EXCLUDED.gender,
        calorieintake = EXCLUDED.calorieintake,
        weightchange = EXCLUDED.weightchange
      RETURNING *;
    `;

		const result = await client.query(query, [userId, weight, height, gender, calorieIntake, weightChange]);

		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error updating weight entry:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const calories = async (req, res) => {
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
};

export const meals = async (req, res) => {
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
		res.json({ meals: mealsResult.rows || "0" });
	} catch (err) {
		console.error("Error fetching meals:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
