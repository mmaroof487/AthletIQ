import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Foodentry from "@/components/Foodentry";
// import Input from "@/components/ui/Input";
// import { Scale, Zap, Plus, X } from "lucide-react";
// import { GoogleGenAI } from "@google/genai";

const Calories = ({ caloriesStats, historyCalorie, minCalorie, maxCalorie }) => {
	const [showAddCalories, setShowAddCalories] = useState(false);

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

			{showAddCalories && <Foodentry setShowAddCalories={setShowAddCalories} />}

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
