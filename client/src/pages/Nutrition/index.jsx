import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { IoAddOutline, IoCalendarOutline } from "react-icons/io5";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const water = {
	consumed: 5,
	goal: 8,
	unit: "glasses",
};
const weeklyCalorieData = [
	{ day: "Mon", calories: 3000 },
	{ day: "Tue", calories: 2900 },
	{ day: "Wed", calories: 2200 },
	{ day: "Thu", calories: 1700 },
	{ day: "Fri", calories: 3100 },
	{ day: "Sat", calories: 1800 },
	{ day: "Sun", calories: 2500 },
];

const Nutrition = () => {
	const [newCalories, setNewCalories] = useState("");
	const [foodName, setFoodName] = useState("");
	const [showAddCalories, setShowAddCalories] = useState(false);
	const [today, setToday] = useState([]);
	const [info, setInfo] = useState({
		totalCalories: 0,
		bodyMeasurement: {
			calorieintake: 0,
		},
	});
	const macroData = [
		{ name: "Protein", value: 40 * 4 },
		{ name: "Carbs", value: 60 * 4 },
		{ name: "Fat", value: 20 * 9 },
	];

	const COLORS = ["#22C55E", "#3B82F6", "#FF6B00"];

	useEffect(() => {
		const fetchTodaysMeals = async () => {
			try {
				const userId = localStorage.getItem("userId");

				const response = await fetch(`http://localhost:5000/api/v1/meals/${userId}`);
				const response1 = await fetch(`http://localhost:5000/api/v1/dashboard/${userId}`);

				if (!response.ok) {
					throw new Error("Failed to fetch today's meals");
				}
				const data = await response.json();
				const data1 = await response1.json();
				setInfo(data1);
				setToday(data.meals);
			} catch (error) {
				console.error("Error fetching today's meals:", error.message);
			}
		};

		fetchTodaysMeals();
	}, []);

	const handleAddCalories = async () => {
		if (!newCalories || isNaN(Number(newCalories)) || !foodName) return;

		const today = new Date().toISOString().split("T")[0];

		try {
			const userId = localStorage.getItem("userId");

			const response = await fetch(`http://localhost:5000/api/v1/fitness/calories`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					date: today,
					calories: Number(newCalories),
					food: foodName,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to add calorie entry");
			}

			await response.json();

			setNewCalories("");
			setFoodName("");
			setShowAddCalories(false);
		} catch (error) {
			console.error("Error adding calorie entry:", error.message);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
				<div>
					<h1 className="heading-1">Nutrition Tracker</h1>
					<p className="text-gray-400 mt-1">Monitor your calories and macronutrients</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<div className="flex items-center space-x-2 text-sm mr-4">
						<IoCalendarOutline size={18} className="text-primary-500" />
						<span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
					</div>

					<Button variant="primary" icon={<IoAddOutline size={18} />} onClick={() => setShowAddCalories(true)}>
						Add Meal
					</Button>
				</div>
			</div>

			{showAddCalories && (
				<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
					<div className="flex flex-col md:flex-row items-end gap-4">
						<div className="flex-grow">
							<Input label="Calories Consumed" type="number" value={newCalories} onChange={(e) => setNewCalories(e.target.value)} placeholder="Enter calories consumed" />
						</div>
						<div className="flex-grow">
							<Input label="Food Name" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Enter food name" />
						</div>

						<div className="flex space-x-2">
							<Button variant="secondary" onClick={() => setShowAddCalories(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={handleAddCalories}>
								Save
							</Button>
						</div>
					</div>
				</motion.div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Today's Summary</h2>
						<div className="text-sm bg-dark-700 px-3 py-1 rounded-full">{Math.round((info.totalCalories / info.bodyMeasurement.calorieintake) * 100) || 0}% of daily goal</div>
					</div>

					<div className="flex flex-col md:flex-row items-center bg-dark-700 rounded-lg p-4">
						<div className="flex-1 flex flex-col items-center md:items-start mb-4 md:mb-0">
							<p className="text-gray-400 mb-1">Calories Consumed</p>
							<div className="flex items-baseline">
								<span className="text-3xl font-bold">{info.totalCalories || 0}</span>
								<span className="text-gray-400 ml-1">/ {info.bodyMeasurement.calorieintake || 0}</span>
							</div>
							<p className="text-sm text-primary-500 mt-1">{info.bodyMeasurement.calorieintake - info.totalCalories} calories remaining</p>
						</div>
					</div>

					<div className="mt-6">
						<h3 className="font-semibold mb-3">Weekly Calories</h3>
						<div className="h-48">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={weeklyCalorieData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="day" tick={{ fill: "#ccc" }} />
									<YAxis tick={{ fill: "#ccc" }} domain={[1500, 2600]} />
									<Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }} labelStyle={{ color: "#fff" }} formatter={(value) => [`${value} calories`, "Intake"]} />
									<Line type="monotone" dataKey="calories" stroke="#FF6B00" strokeWidth={3} dot={{ fill: "#FF6B00", r: 4 }} activeDot={{ fill: "#FF6B00", r: 6, stroke: "#fff", strokeWidth: 2 }} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</Card>

				<Card>
					<h2 className="text-xl font-semibold mb-4">Macros Distribution</h2>

					<div className="h-48 flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={macroData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
									{macroData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
									formatter={(value, name) => {
										const totalCalories = macroData.reduce((sum, item) => sum + item.value, 0);
										const percentage = Math.round((value / totalCalories) * 100);
										return [`${percentage}% (${value} cal)`, name];
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>

					<div className="flex justify-center space-x-4 mt-2">
						{macroData.map((entry, index) => (
							<div key={index} className="flex items-center">
								<div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
								<span className="text-sm">{entry.name}</span>
							</div>
						))}
					</div>

					<div className="mt-6 bg-dark-700 rounded-lg p-4">
						<h3 className="font-semibold mb-2">Water Intake</h3>
						<div className="flex items-center">
							<div className="relative flex-1 h-4 bg-dark-800 rounded-full overflow-hidden mr-4">
								<div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full" style={{ width: `${(water.consumed / water.goal) * 100}%` }}></div>
							</div>
							<div className="text-sm whitespace-nowrap">
								{water.consumed} / {water.goal} {water.unit}
							</div>
						</div>
						<div className="flex justify-center mt-3">
							<Button variant="outline" size="sm">
								Add Water
							</Button>
						</div>
					</div>
				</Card>
			</div>

			<Card title="Today's Meals">
				<div className="space-y-4">
					{today.length === 0 ? (
						<p>No meals available for today. Please add your meals.</p>
					) : (
						today.map((meal) => (
							<div key={meal.id} className="border-b border-dark-700 pb-4 last:border-0 last:pb-0">
								<div className="flex items-center justify-between cursor-pointer">
									<div className="flex items-center">
										<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">{meal.icon}</div>
										<div>
											<h3 className="font-semibold">{meal.name}</h3>
										</div>
									</div>

									<div className="flex items-center">
										<div className="text-sm  mr-4 hidden md:grid">
											<div>
												<span className="text-primary-500"> {meal.calories} calories</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</Card>
		</div>
	);
};

export default Nutrition;
