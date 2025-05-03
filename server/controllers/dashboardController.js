import client from "../db/client.js";

export const getDashboardData = async (req, res) => {
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
};
