import { useState, useEffect } from "react";
import Calories from "./components/calories";
import Weights from "./components/weight";

const FitnessTracker = () => {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("calories");
	const [data, setData] = useState();
	const clientUrl = import.meta.env.VITE_CLIENT_URL;

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response = await fetch(`${clientUrl}/user/dashboard/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			setData(data);
			setLoading(false);
		} catch (err) {
			console.error(err.message || "Failed to fetch user profile");
		}
	};

	const weightStats = {
		current: data?.bodyMeasurement?.weight || 0,
		change: data?.bodyMeasurement?.weightchange || 0,
		start: data?.bodyMeasurement?.startingweight || 0,
	};

	const caloriesStats = {
		average: data?.bodyMeasurement?.calorieintake || 0,
		total: data?.totalCalories || 0,
		highest: data?.calorieHistory.length ? Math.max(...data.calorieHistory.map((day) => day.value)) : 0,
	};

	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}
	const historyWeight = data?.weightHistory || [];
	const weights = historyWeight.map((item) => item.value);
	const minWeight = Math.min(...weights) - 5 || 0;
	const maxWeight = Math.max(...weights) + 5 || 100;
	const historyCalorie = data?.calorieHistory || [];
	const calories = historyCalorie.map((item) => item.value);
	const minCalorie = Math.min(...calories) - 100 || 0;
	const maxCalorie = Math.max(...calories) + 500 || 3000;
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

			{activeTab === "calories" && <Calories caloriesStats={caloriesStats} historyCalorie={historyCalorie} minCalorie={minCalorie} maxCalorie={maxCalorie} />}

			{activeTab === "weight" && <Weights weightStats={weightStats} historyWeight={historyWeight} minWeight={minWeight} maxWeight={maxWeight} clientUrl={clientUrl} />}
		</div>
	);
};

export default FitnessTracker;
