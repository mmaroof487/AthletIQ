import client from "../config/db.js";

function calculateCalories(weight, height, age, gender, activityFactor = 1.2) {
	let bmr;
	if (gender.toLowerCase() === "male") {
		bmr = 10 * weight + 6.25 * height - 5 * age + 5;
	} else if (gender.toLowerCase() === "female") {
		bmr = 10 * weight + 6.25 * height - 5 * age - 161;
	} else {
		bmr = 10 * weight + 6.25 * height - 5 * age - 120;
	}
	return Math.round(bmr * activityFactor);
}

export const addWeight = async (req, res) => {
	const { userId, weight } = req.body;

	if (!userId || !weight || isNaN(weight)) {
		return res.status(400).json({ error: "Invalid data provided" });
	}

	const date = new Date().toISOString().split("T")[0];

	try {
		await client.query("BEGIN");

		const userResult = await client.query("SELECT height, gender, birthday FROM clients WHERE id = $1", [userId]);
		if (userResult.rows.length === 0) {
			await client.query("ROLLBACK");
			return res.status(404).json({ error: "User not found" });
		}

		const { height, gender, birthday } = userResult.rows[0] || {};
		const today = new Date();
		const birthDate = new Date(birthday);
		let age = today.getFullYear() - birthDate.getFullYear();
		if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;

		const calorieIntake = calculateCalories(weight, height, age, gender || "male");

		const bodyResult = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);

		let startingWeight, weightChange;

		if (bodyResult.rows.length === 0) {
			// First weight entry
			startingWeight = weight;
			weightChange = 0;

			await client.query(
				`INSERT INTO bodymeasurement
				(user_id, date, weight, startingweight, weightchange, calorieintake, height, gender)
				VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
				[userId, date, weight, startingWeight, weightChange, calorieIntake, height, gender]
			);
		} else {
			const existing = bodyResult.rows[0];
			startingWeight = existing.startingweight || existing.weight;
			weightChange = weight - startingWeight;

			await client.query(
				`UPDATE bodymeasurement
				SET date=$1, weight=$2, weightchange=$3, calorieintake=$4, height=$5, gender=$6
				WHERE user_id=$7`,
				[date, weight, weightChange, calorieIntake, height, gender, userId]
			);
		}

		const historyResult = await client.query("INSERT INTO weight_history (user_id, date, weight) VALUES ($1, $2, $3) RETURNING *", [userId, date, weight]);

		await client.query("COMMIT");

		return res.status(200).json({
			message: "Weight updated successfully",
			current: { weight, weightChange, calorieIntake, startingWeight },
			historyEntry: historyResult.rows[0],
		});
	} catch (err) {
		await client.query("ROLLBACK");
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

		res.json({ meals: mealsResult.rows || [] });
	} catch (err) {
		console.error("Error fetching meals:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
