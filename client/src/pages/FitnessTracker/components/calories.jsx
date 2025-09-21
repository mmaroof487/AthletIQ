import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Scale, Zap, Plus, X } from "lucide-react";

const Calories = ({ caloriesStats, historyCalorie, minCalorie, maxCalorie, clientUrl }) => {
	const [showAddCalories, setShowAddCalories] = useState(false);
	const [useWeightOption, setUseWeightOption] = useState(false);
	const [foodWeight, setFoodWeight] = useState("");
	const [newCalories, setNewCalories] = useState("");
	const [foodName, setFoodName] = useState("");

	const handleAddCalories = async () => {
		if (!newCalories || isNaN(Number(newCalories)) || !foodName) return;

		const today = new Date().toISOString().split("T")[0];

		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response = await fetch(`${clientUrl}/fitness/calories`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId, date: today, calories: Number(newCalories), food: foodName }),
			});

			if (!response.ok) throw new Error("Failed to add calorie entry");

			window.location.reload();
			setNewCalories("");
			setFoodName("");
			setShowAddCalories(false);
		} catch (error) {
			console.error("Error adding calorie entry:", error.message);
		}
	};

	return (
		<div className="space-y-6">
			{!showAddCalories && (
				<div className="flex justify-between items-center">
					<h2 className="heading-2">Calorie Tracking</h2>{" "}
					<Button variant="secondary" size="sm" onClick={() => setShowAddCalories(!showAddCalories)}>
						Add Entry
					</Button>
				</div>
			)}

			{showAddCalories && (
				<motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
					<Card>
						<button
							onClick={() => setShowAddCalories(false)}
							className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white
               hover:bg-gray-800/50 rounded-lg transition-all duration-200">
							<X size={20} />
						</button>

						<div className="mb-6">
							<h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
								<Plus className="text-orange-500" size={24} />
								Add Food Entry
							</h3>
						</div>

						<div className="flex items-center gap-2 mb-6 p-1 bg-gray-800/60 rounded-xl border border-gray-700/50">
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => setUseWeightOption(false)}
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
									!useWeightOption ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-gray-700/50"
								}`}>
								<Zap size={18} />
								Name & Calories
							</motion.button>
							<motion.button
								whileTap={{ scale: 0.98 }}
								onClick={() => setUseWeightOption(true)}
								className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
									useWeightOption ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-gray-700/50"
								}`}>
								<Scale size={18} />
								Name & Weight
							</motion.button>
						</div>

						<div className="space-y-5">
							<Input label="Food Name" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Enter food name (e.g., Grilled Chicken)" />

							<motion.div key={useWeightOption ? "weight" : "calories"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
								{!useWeightOption ? (
									<Input label="Calories Consumed" type="number" value={newCalories} onChange={(e) => setNewCalories(e.target.value)} placeholder="Enter calories consumed (e.g., 250)" />
								) : (
									<Input label="Weight (grams)" type="number" value={foodWeight} onChange={(e) => setFoodWeight(e.target.value)} placeholder="Enter weight of food (e.g., 100)" />
								)}
							</motion.div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-700/50">
							<Button variant="secondary" onClick={() => setShowAddCalories(false)} className="flex-1 sm:flex-none sm:px-8 bg-gray-700 text-white hover:bg-gray-600">
								Cancel
							</Button>
							<Button variant="primary" onClick={handleAddCalories} className="flex-1 sm:flex-none sm:px-8 bg-orange-500 text-black hover:bg-orange-600">
								Save Entry
							</Button>
						</div>
					</Card>
				</motion.div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{caloriesStats && (
					<>
						<Card>
							<p className="text-gray-400 text-sm">Average Daily</p>
							<p className="text-2xl font-bold">{caloriesStats.average || "0"} cal</p>
						</Card>
						<Card>
							<p className="text-gray-400 text-sm">Total Today</p>
							<p className="text-2xl font-bold">{caloriesStats.total || "0"} cal</p>
						</Card>
						<Card>
							<p className="text-gray-400 text-sm">Highest Day</p>
							<p className="text-2xl font-bold">{caloriesStats.highest} cal</p>
						</Card>
					</>
				)}
			</div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
				<Card title="Calorie Tracking">
					<div className="h-64">
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
				</Card>
			</motion.div>
		</div>
	);
};

export default Calories;
