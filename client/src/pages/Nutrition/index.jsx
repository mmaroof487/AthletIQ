import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { IoCalendarOutline } from "react-icons/io5";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Utensils } from "lucide-react";

const water = {
	consumed: 5,
	goal: 8,
	unit: "glasses",
};

const Nutrition = () => {
	const [loading, setLoading] = useState(true);
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
	const clientUrl = import.meta.env.VITE_CLIENT_URL;

	useEffect(() => {
		fetchTodaysMeals();
	}, []);

	const fetchTodaysMeals = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response1 = await fetch(`${clientUrl}/user/dashboard/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data1 = await response1.json();
			if (!response1.ok) {
				throw new Error("Failed to fetch user data");
			}
			setInfo(data1);
			setLoading(false);

			const response = await fetch(`${clientUrl}/fitness/meals/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch today's meals");
			}
			const data = await response.json();
			setToday(data.meals);
		} catch (error) {
			console.error("Error fetching today's meals:", error.message);
		}
	};

	const historyCalorie = info?.calorieHistory || [];
	const calories = historyCalorie.map((item) => item.value);
	const minCalorie = Math.min(...calories) - 100 || 0;
	const maxCalorie = Math.max(...calories) + 500 || 3000;
	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}
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
				</div>
			</div>

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
								<LineChart data={historyCalorie} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
									<YAxis tick={{ fill: "#ccc" }} domain={[minCalorie, maxCalorie]} />
									<Tooltip
										contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
										labelStyle={{ color: "#fff" }}
										formatter={(value) => [`${value} kcal`]}
										labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
									/>
									<Line type="monotone" dataKey="value" stroke="#FF6B00" strokeWidth={3} dot={{ fill: "#FF6B00", r: 4 }} activeDot={{ fill: "#FF6B00", r: 6, stroke: "#fff", strokeWidth: 2 }} />
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
										<Utensils className="text-primary-500 mr-2" />
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
