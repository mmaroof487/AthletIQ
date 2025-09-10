import client from "../config/db.js";

export const addWeight = async (req, res) => {
	const { userId, date, weight } = req.body;

	if (!userId || !date || !weight || isNaN(weight)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	try {
		const userQuery = "SELECT * FROM member WHERE id = $1";
		const userResult = await client.query(userQuery, [userId]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		const prevWeightQuery = "SELECT weight FROM bodymeasurement WHERE user_id = $1 ORDER BY date DESC LIMIT 1";
		const prevWeightResult = await client.query(prevWeightQuery, [userId]);

		let weightChange = 0;

		if (prevWeightResult.rows.length > 0) {
			const previousWeight = prevWeightResult.rows[0].weight;
			weightChange = weight - previousWeight;
		}

		const checkRecordQuery = "SELECT * FROM bodymeasurement WHERE user_id = $1 AND date = $2";
		const checkRecordResult = await client.query(checkRecordQuery, [userId, date]);

		let result;
		if (checkRecordResult.rows.length > 0) {
			const updateQuery = `
                UPDATE bodymeasurement
                SET weight = $1, weightchange = $2
                WHERE user_id = $3 AND date = $4
                RETURNING *`;

			result = await client.query(updateQuery, [weight, weightChange, userId, date]);
		} else {
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
};

export const addCalories = async (req, res) => {
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

export const getMeals = async (req, res) => {
	const userId = req.params.userId;

	try {
		const currentDate = new Date().toISOString().split("T")[0];

		const mealsQuery = `
            SELECT *
            FROM meals
            WHERE user_id = $1 AND date = $2
        `;
		const mealsResult = await client.query(mealsQuery, [userId, currentDate]);

		if (mealsResult.rows.length === 0) {
			return res.status(404).json({ error: "No meals found for today" });
		}

		res.json({ meals: mealsResult.rows });
	} catch (err) {
		console.error("Error fetching meals:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
