import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/services/api";

function FitnessTracker() {
	const [fitnessData, setFitnessData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("calories");
	const [showAddCalories, setShowAddCalories] = useState(false);
	const [showAddWeight, setShowAddWeight] = useState(false);
	const [newWeight, setNewWeight] = useState("");
	const [newCalories, setNewCalories] = useState("");
	const [foodName, setFoodName] = useState("");
	const [data, setData] = useState();

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const response = await fetch(`http://localhost:5000/api/v1/dashboard/${userId}`);
			setLoading(false);
			const data2 = await api.getFitnessData();
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			setData(data);
			setFitnessData(data2);
		} catch (err) {
			console.error(err.message || "Failed to fetch user profile");
		}
	};

	const handleAddWeight = async () => {
		if (!newWeight || isNaN(Number(newWeight))) return;

		const today = new Date().toISOString().split("T")[0];

		try {
			const userId = localStorage.getItem("userId");
			const response = await fetch(`http://localhost:5000/api/v1/fitness/weight`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, date: today, weight: Number(newWeight) }),
			});

			if (!response.ok) throw new Error("Failed to add weight entry");

			setFitnessData((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					weight: [...prev.weight, { date: today, value: Number(newWeight) }],
				};
			});

			setNewWeight("");
			setShowAddWeight(false);
		} catch (error) {
			console.error("Error adding weight entry:", error.message);
		}
	};

	const handleAddCalories = async () => {
		if (!newCalories || isNaN(Number(newCalories)) || !foodName) return;

		const today = new Date().toISOString().split("T")[0];

		try {
			const userId = localStorage.getItem("userId");

			const response = await fetch(`http://localhost:5000/api/v1/fitness/calories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, date: today, calories: Number(newCalories), food: foodName }),
			});

			if (!response.ok) throw new Error("Failed to add calorie entry");

			setFitnessData((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					calories: [...prev.calories, { date: today, value: Number(newCalories), food: foodName }],
				};
			});

			setNewCalories("");
			setFoodName("");
			setShowAddCalories(false);
		} catch (error) {
			console.error("Error adding calorie entry:", error.message);
		}
	};

	const weightStats = fitnessData?.weight.length
		? {
				current: fitnessData.weight[fitnessData.weight.length - 1].value,
				change: fitnessData.weight[fitnessData.weight.length - 1].value - fitnessData.weight[0].value,
				start: fitnessData.weight[0].value,
		  }
		: null;

	const caloriesStats = fitnessData?.calories.length
		? {
				average: Math.round(fitnessData.calories.reduce((sum, day) => sum + day.value, 0) / fitnessData.calories.length),
				highest: Math.max(...fitnessData.calories.map((day) => day.value)),
				lowest: Math.min(...fitnessData.calories.map((day) => day.value)),
		  }
		: null;

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
					<h1 className="heading-1">Fitness Tracker</h1>
					<p className="text-gray-400 mt-1">Monitor your progress and stay on track</p>
				</div>
				<div className="flex items-center space-x-2 mt-4 md:mt-0 text-sm">
					<span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
				</div>
			</div>

			<div className="flex border-b border-dark-700">
				{["calories", "weight"].map((tab) => (
					<button
						key={tab}
						className={`px-6 py-3 font-medium focus:outline-none ${activeTab === tab ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
						onClick={() => setActiveTab(tab)}>
						{tab === "weight" ? "Weight Tracking" : "Calorie Tracking"}
					</button>
				))}
			</div>

			{activeTab === "calories" && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="heading-2">Calorie Tracking</h2>
						<Button variant="secondary" size="sm" onClick={() => setShowAddCalories(!showAddCalories)}>
							Add Entry
						</Button>
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

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{caloriesStats && (
							<>
								<Card>
									<p className="text-gray-400 text-sm">Average Daily</p>
									<p className="text-2xl font-bold">{caloriesStats.average} cal</p>
								</Card>
								<Card>
									<p className="text-gray-400 text-sm">Highest Day</p>
									<p className="text-2xl font-bold">{caloriesStats.highest} cal</p>
								</Card>
								<Card>
									<p className="text-gray-400 text-sm">Lowest Day</p>
									<p className="text-2xl font-bold">{caloriesStats.lowest} cal</p>
								</Card>
							</>
						)}
					</div>

					<Card>
						<div className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={fitnessData?.calories}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="date" tick={{ fill: "#ccc" }} />
									<YAxis tick={{ fill: "#ccc" }} />
									<Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }} />
									<Line type="monotone" dataKey="value" stroke="#FF6B00" strokeWidth={3} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</div>
			)}

			{activeTab === "weight" && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="heading-2">Weight Tracking</h2>
						<Button variant="secondary" size="sm" onClick={() => setShowAddWeight(!showAddWeight)}>
							Add Entry
						</Button>
					</div>

					{showAddWeight && (
						<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
							<div className="flex flex-col md:flex-row items-end gap-4">
								<div className="flex-grow">
									<Input label="Weight (kg)" type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Enter your weight" />
								</div>
								<div className="flex space-x-2">
									<Button variant="secondary" onClick={() => setShowAddWeight(false)}>
										Cancel
									</Button>
									<Button variant="primary" onClick={handleAddWeight}>
										Save
									</Button>
								</div>
							</div>
						</motion.div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{weightStats && (
							<>
								<Card>
									<p className="text-gray-400 text-sm">Current Weight</p>
									<p className="text-2xl font-bold">{data.weight} kg</p>
								</Card>
								<Card>
									<p className="text-gray-400 text-sm">Weight Change</p>
									<p className="text-2xl font-bold">{data.weightchange} kg</p>
								</Card>
								<Card>
									<p className="text-gray-400 text-sm">Starting Weight</p>
									<p className="text-2xl font-bold">{weightStats.start} kg</p>
								</Card>
							</>
						)}
					</div>

					<Card>
						<div className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={fitnessData?.weight}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="date" tick={{ fill: "#ccc" }} />
									<YAxis tick={{ fill: "#ccc" }} />
									<Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }} />
									<Area type="monotone" dataKey="value" stroke="#FF6B00" fillOpacity={1} fill="url(#weightGradient)" />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}

export default FitnessTracker;
