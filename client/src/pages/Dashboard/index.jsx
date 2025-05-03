import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Calendar, TrendingUp, Activity, Dumbbell, Utensils, ScaleIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { api } from "@/services/api";

const Dashboard = ({ user }) => {
	const [fitnessData, setFitnessData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(true);
	const [data, setData] = useState("");
	const [cal, setCal] = useState("");

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const response = await fetch(`http://localhost:5000/api/v1/dashboard/${userId}`);
			setLoading(false);
			const data = await response.json();
			const data2 = await api.getFitnessData();
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			setCal(data.totalCalories);
			setData(data.bodyMeasurement);
			setFitnessData(data2);
		} catch (err) {
			setError(err.message || "Failed to fetch user profile");
		}
	};

	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	const workoutStats = {
		totalDuration: fitnessData?.workouts.reduce((total, workout) => total + workout.duration, 0) || 0,
		avgDuration: fitnessData?.workouts.length ? Math.round(fitnessData.workouts.reduce((total, workout) => total + workout.duration, 0) / fitnessData.workouts.length) : 0,
		workoutsByType:
			fitnessData?.workouts.reduce((acc, workout) => {
				acc[workout.type] = (acc[workout.type] || 0) + 1;
				return acc;
			}, {}) || {},
	};

	const workoutTypeData = Object.entries(workoutStats.workoutsByType).map(([name, value]) => ({
		name,
		value,
	}));

	const COLORS = ["#FF6B00", "#FF9D4D", "#FFCF99", "#AF4A00"];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="heading-1">Dashboard</h1>
					<p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
				</div>
				<div className="flex items-center space-x-2 text-sm">
					<Calendar size={18} className="text-primary-500" />
					<span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
					<Card className="flex items-center">
						<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
							<ScaleIcon size={24} className="text-primary-500" />
						</div>
						<div>
							<p className="text-gray-400 text-sm">Current Weight</p>
							<p className="text-2xl font-bold">{data?.weight || 0} kg</p>
						</div>
					</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
					<Card className="flex items-center">
						<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
							<TrendingUp size={24} className="text-primary-500" />
						</div>
						<div>
							<p className="text-gray-400 text-sm">Weight Change</p>
							<p className="text-2xl font-bold">{data?.weightchange || 0} kg</p>
						</div>
					</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
					<Card className="flex items-center">
						<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
							<Utensils size={24} className="text-primary-500" />
						</div>
						<div>
							<p className="text-gray-400 text-sm">Avg. Daily Calories</p>
							<p className="text-2xl font-bold">{data?.calorieintake || 0}</p>
						</div>
					</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
					<Card className="flex items-center">
						<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
							<Activity size={24} className="text-primary-500" />
						</div>
						<div>
							<p className="text-gray-400 text-sm">Consumned today:</p>
							<p className="text-2xl font-bold">{cal || 0}</p>
						</div>
					</Card>
				</motion.div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
					<Card title="Weight Progress">
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={fitnessData?.weight} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
									<YAxis tick={{ fill: "#ccc" }} />
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

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
					<Card title="Daily Calorie Intake">
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={fitnessData?.calories} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })} />
									<YAxis tick={{ fill: "#ccc" }} />
									<Tooltip
										contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
										labelStyle={{ color: "#fff" }}
										formatter={(value) => [`${value} kcal`, "Calories"]}
										labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
									/>
									<Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</motion.div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }} className="md:col-span-2">
					<Card title="Recent Workouts">
						<div className="space-y-4">
							{fitnessData?.workouts.length ? (
								fitnessData.workouts
									.slice()
									.reverse()
									.map((workout, index) => (
										<div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
											<div className="flex items-center">
												<div className="p-2 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
													<Dumbbell size={20} className="text-primary-500" />
												</div>
												<div>
													<p className="font-medium">{workout.type} Workout</p>
													<p className="text-sm text-gray-400">
														{new Date(workout.date).toLocaleDateString("en-US", {
															weekday: "long",
															month: "short",
															day: "numeric",
														})}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium">{workout?.duration} min</p>
											</div>
										</div>
									))
							) : (
								<p className="text-gray-400 text-center py-4">No workout data available</p>
							)}
						</div>
					</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
					<Card title="Workout Types">
						{workoutTypeData.length > 0 ? (
							<div className="h-64 flex flex-col items-center justify-center">
								<ResponsiveContainer width="100%" height="80%">
									<PieChart>
										<Pie
											data={workoutTypeData}
											cx="50%"
											cy="50%"
											outerRadius={80}
											innerRadius={40}
											paddingAngle={5}
											dataKey="value"
											label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
											labelLine={false}>
											{workoutTypeData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }} formatter={(value) => [`${value} sessions`, ""]} />
									</PieChart>
								</ResponsiveContainer>
								<div className="text-center">
									<p className="text-sm text-gray-400">Total Duration: {workoutStats.totalDuration} mins</p>
									<p className="text-sm text-gray-400">Avg. Duration: {workoutStats.avgDuration} mins</p>
								</div>
							</div>
						) : (
							<div className="h-64 flex items-center justify-center">
								<p className="text-gray-400 text-center">No workout data available</p>
							</div>
						)}
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default Dashboard;
