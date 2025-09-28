import client from "../config/db.js";

export const getDashboard = async (req, res) => {
	const { userId } = req.params;

	try {
		const date = new Date().toISOString().split("T")[0];

		const bodyMeasurementResult = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);
		if (bodyMeasurementResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		const bodyMeasurement = bodyMeasurementResult.rows.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

		const mealsResult = await client.query(
			`SELECT COALESCE(SUM(calories),0) AS total_calories
			FROM meals
			WHERE user_id = $1 AND date = $2`,
			[userId, date]
		);

		const weightResult = await client.query(
			`SELECT weight, date
       		FROM weight_history
       		WHERE user_id = $1
       		ORDER BY date DESC
       		LIMIT 5`,
			[userId]
		);

		const calorieResult = await client.query(
			`SELECT date, SUM(calories) AS total_calories
			FROM meals
			WHERE user_id = $1
			GROUP BY date
			ORDER BY date DESC
			LIMIT 5`,
			[userId]
		);

		res.json({
			bodyMeasurement,
			totalCalories: mealsResult.rows[0].total_calories,
			weightHistory: weightResult.rows.reverse().map((row) => ({ date: row.date, value: row.weight })),
			calorieHistory: calorieResult.rows.reverse().map((row) => ({ date: row.date, value: Number(row.total_calories) })),
		});
	} catch (err) {
		console.error("Error fetching user dashboard:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProfile = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await client.query("SELECT * FROM clients WHERE id = $1", [userId]);
		const body = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);
		if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

		res.json([user.rows[0], body.rows[0]]);
	} catch (err) {
		console.error("Error fetching profile:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProfile = async (req, res) => {
	const { userId, name, phone, address, birthday, height, weight, fitnessGoal, gender, imgurl } = req.body;

	try {
		if (!name) return res.status(400).json({ message: "Name is required." });

		const userQuery = `SELECT * FROM clients WHERE id = $1`;
		const userResult = await client.query(userQuery, [userId]);
		if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found." });

		const birthDate = new Date(birthday);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		let m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

		const activityLevel = 1.2;
		let bmr;
		if (gender.toLowerCase() === "male") {
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else if (gender.toLowerCase() === "female") {
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		} else {
			bmr = 10 * weight + 6.25 * height - 5 * age - 120;
		}
		const calorieIntake = Math.round(bmr * activityLevel);

		const clientUpdateQuery = `
      UPDATE clients
      SET name = $2, phone_number = $3, address = $4, birthday = $5, fitnessgoal = $6, age = $7, imageurl=$8
      WHERE id = $1;
    `;
		await client.query(clientUpdateQuery, [userId, name, phone, address, birthday, fitnessGoal, age, imgurl]);

		const existingResult = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);

		let startingWeight, weightChange;
		const date = new Date().toISOString().split("T")[0];

		if (existingResult.rows.length === 0) {
			// First weight entry
			startingWeight = weight;
			weightChange = 0;

			const insertQuery = `
        INSERT INTO bodymeasurement (user_id, date, weight, startingweight, weightchange, calorieintake, height, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
			await client.query(insertQuery, [userId, date, weight, startingWeight, weightChange, calorieIntake, height, gender]);
		} else {
			// Update existing measurement
			const existing = existingResult.rows[0];
			startingWeight = existing.startingweight || existing.weight;
			weightChange = weight - startingWeight;

			const updateQuery = `
        UPDATE bodymeasurement
        SET date = $1, weight = $2, weightchange = $3, calorieintake = $4, height = $5, gender = $6
        WHERE user_id = $7
        RETURNING *;
      `;
			await client.query(updateQuery, [date, weight, weightChange, calorieIntake, height, gender, userId]);
		}

		await client.query("INSERT INTO weight_history (user_id, date, weight) VALUES ($1, $2, $3)", [userId, date, weight]);

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
};
