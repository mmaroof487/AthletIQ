import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Scale, X } from "lucide-react";

const Weight = ({ weightStats, historyWeight, minWeight, maxWeight, clientUrl }) => {
	const [showAddWeight, setShowAddWeight] = useState(false);
	const [newWeight, setNewWeight] = useState("");

	const handleAddWeight = async () => {
		if (!newWeight || isNaN(Number(newWeight))) return;

		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response = await fetch(`${clientUrl}/fitness/weight`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId, weight: Number(newWeight) }),
			});

			if (!response.ok) throw new Error("Failed to add weight entry");

			window.location.reload();
		} catch (error) {
			console.error("Error adding weight entry:", error.message);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="heading-2">Weight Tracking</h2>
				<Button variant="secondary" size="sm" onClick={() => setShowAddWeight(!showAddWeight)}>
					Add Entry
				</Button>
			</div>

			{showAddWeight && (
				<motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
					<Card>
						<button
							onClick={() => setShowAddWeight(false)}
							className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white
               hover:bg-gray-800/50 rounded-lg transition-all duration-200">
							<X size={20} />
						</button>

						<div className="mb-6">
							<h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
								<Scale className="text-orange-500" size={24} />
								Add Weight
							</h3>
							<p className="text-gray-400 text-sm">Log your current weight</p>
						</div>

						<div className="flex flex-col md:flex-row items-center gap-4">
							<div className="flex-grow w-full">
								<Input label="Weight (kg)" type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Enter your weight" />
							</div>
							<div className="flex space-x-2 pt-1">
								<Button variant="secondary" onClick={() => setShowAddWeight(false)} className="bg-dark-700 text-white hover:bg-gray-600">
									Cancel
								</Button>
								<Button variant="primary" onClick={handleAddWeight} className="bg-orange-500 text-black hover:bg-orange-600">
									Save
								</Button>
							</div>
						</div>
					</Card>
				</motion.div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{weightStats && (
					<>
						<Card>
							<p className="text-gray-400 text-sm">Current Weight</p>
							<p className="text-2xl font-bold">{weightStats.current} kg</p>
						</Card>
						<Card>
							<p className="text-gray-400 text-sm">Weight Change</p>
							<p className="text-2xl font-bold">{weightStats.change} kg</p>
						</Card>
						<Card>
							<p className="text-gray-400 text-sm">Starting Weight</p>
							<p className="text-2xl font-bold">{weightStats.start} kg</p>
						</Card>
					</>
				)}
			</div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
				<Card title="Weight Progress">
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={historyWeight} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" />
								<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
								<YAxis tick={{ fill: "#ccc" }} domain={[minWeight, maxWeight]} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
									labelStyle={{ color: "#fff" }}
									formatter={(value) => [`${value} kgs`, "Weight"]}
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

export default Weight;
