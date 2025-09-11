import client from "../config/db.js";

export const getDashboard = async (req, res) => {
	const { userId } = req.params;
	try {
		const bodyMeasurementQuery = "SELECT * FROM bodymeasurement WHERE user_id = $1";
		const bodyMeasurementResult = await client.query(bodyMeasurementQuery, [userId]);

		if (bodyMeasurementResult.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		const currentDate = new Date().toISOString().split("T")[0];
		const mealsQuery = `
      SELECT SUM(calories) AS total_calories
      FROM meals
      WHERE user_id = $1 AND date = $2
    `;
		const mealsResult = await client.query(mealsQuery, [userId, currentDate]);

		const weightQuery = `
      SELECT weight, date
      FROM bodymeasurement
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 5
    `;
		const weightResult = await client.query(weightQuery, [userId]);

		const calorieQuery = `
      SELECT date, SUM(calories) AS total_calories
      FROM meals
      WHERE user_id = $1
      GROUP BY date
      ORDER BY date DESC
      LIMIT 5
    `;
		const calorieResult = await client.query(calorieQuery, [userId]);

		res.json({
			bodyMeasurement: bodyMeasurementResult.rows[0], // leave as-is
			totalCalories: mealsResult.rows[0].total_calories || 0, // leave as-is

			weightHistory: weightResult.rows.map((row) => ({
				date: row.date,
				value: row.weight,
			})),
			calorieHistory: calorieResult.rows.map((row) => ({
				date: row.date,
				value: Number(row.total_calories) || 0,
			})),
		});
	} catch (err) {
		console.error("Error fetching user dashboard:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProfile = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await client.query("SELECT * FROM member WHERE id = $1", [userId]);
		const body = await client.query("SELECT * FROM bodymeasurement WHERE user_id = $1", [userId]);

		if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

		res.json([user.rows[0], body.rows[0]]);
	} catch (err) {
		console.error("Error fetching profile:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProfile = async () => {
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
};
