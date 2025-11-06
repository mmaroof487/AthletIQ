import Input from "@/components/ui/Input";
import { Scale, Zap, Plus, X } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const Foodentry = ({ setShowAddCalories }) => {
	const [useWeightOption, setUseWeightOption] = useState(true);
	const [loading, setLoading] = useState(false);
	const clientUrl = import.meta.env.VITE_CLIENT_URL;
	const apiKey = import.meta.env.VITE_API_KEY;
	const ai = new GoogleGenAI({ apiKey: apiKey });
	const [food, setFood] = useState({
		name: "",
		calories: "",
		weight: "",
		protein: "",
		carbs: "",
		fat: "",
	});

	const handleCalculateCalories = async () => {
		setLoading(true);
		try {
			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents:
					"calories, protein, carbohydrates, fat for this food and weight in that order separated by an empty space e.g., calories protein carbohydrates fat, just this return number nothing else: " +
					food.name +
					" " +
					food.weight +
					" grams/ml",
			});

			const botReply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

			setFood({
				...food,
				calories: botReply.split(" ")[0],
				protein: botReply.split(" ")[1],
				carbs: botReply.split(" ")[2],
				fat: botReply.split(" ")[3],
			});
			setUseWeightOption(false);
			setLoading(false);
		} catch (error) {
			console.error("API Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddCalories = async () => {
		setLoading(true);
		if (!food.calories || isNaN(Number(food.calories)) || !food.name) return;

		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response = await fetch(`${clientUrl}/fitness/calories`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ userId, food }),
			});

			if (!response.ok) throw new Error("Failed to add calorie entry");

			setFood({
				name: "",
				calories: "",
				weight: "",
				protein: "",
				carbs: "",
				fats: "",
			});
			setShowAddCalories(false);
		} catch (error) {
			console.error("Error adding calorie entry:", error.message);
		} finally {
			// window.location.reload();
			setLoading(false);
		}
	};

	return (
		<motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
			<Card>
				<button onClick={() => setShowAddCalories(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-all duration-200">
					<X size={20} />
				</button>

				<div className="mb-6">
					<h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
						<Plus className="text-orange-500" size={24} />
						Add Food Entry
					</h3>
				</div>
				<div className="space-y-5">
					<Input label="Food Name" type="text" value={food.name} onChange={(e) => setFood({ ...food, name: e.target.value })} placeholder="Enter food name" />
					{!loading ? (
						<>
							<div className="flex items-center gap-2 mb-6 p-1 bg-dark-700/60 rounded-xl border border-gray-700/50 w-1/2">
								<motion.button
									whileTap={{ scale: 0.98 }}
									onClick={() => setUseWeightOption(true)}
									className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
										useWeightOption ? "bg-orange-500 text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-dark-700/50"
									}`}>
									<Scale size={18} />
									Weight
								</motion.button>
								<motion.button
									whileTap={{ scale: 0.98 }}
									onClick={() => setUseWeightOption(false)}
									className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
										!useWeightOption ? "bg-orange-500 text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-dark-700/50"
									}`}>
									<Zap size={18} />
									Calories
								</motion.button>
							</div>

							<motion.div key={useWeightOption ? "weight" : "calories"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
								{!useWeightOption ? (
									<>
										<Input label="Calories Consumed" type="number" value={food.calories} onChange={(e) => setFood({ ...food, calories: e.target.value })} placeholder="Enter calories consumed" />
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
											<Input label="Protein (g)" type="number" value={food.protein} onChange={(e) => setFood({ ...food, protein: e.target.value })} placeholder="Enter protein" />
											<Input label="Carbs (g)" type="number" value={food.carbs} onChange={(e) => setFood({ ...food, carbs: e.target.value })} placeholder="Enter carbohydrates" />
											<Input label="Fat (g)" type="number" value={food.fat} onChange={(e) => setFood({ ...food, fat: e.target.value })} placeholder="Enter fat" />
										</div>
									</>
								) : (
									<Input label="Weight (grams/ml)" type="number" value={food.weight} onChange={(e) => setFood({ ...food, weight: e.target.value })} placeholder="Enter weight of food" />
								)}
							</motion.div>

							<div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-dark-700/50">
								<Button variant="secondary" onClick={() => setShowAddCalories(false)} className="flex-1 sm:flex-none sm:px-8 bg-dark-700 text-white hover:bg-dark-600">
									Cancel
								</Button>
								{!useWeightOption ? (
									<Button variant="primary" onClick={handleAddCalories} className="flex-1 sm:flex-none sm:px-8 bg-orange-500 text-black hover:bg-orange-600">
										Log Entry
									</Button>
								) : (
									<Button variant="primary" onClick={handleCalculateCalories} className="flex-1 sm:flex-none sm:px-8 bg-orange-500 text-black hover:bg-orange-600">
										Calculate
									</Button>
								)}
							</div>
						</>
					) : (
						<>
							<div className="h-full w-full flex items-center justify-center">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
							</div>
						</>
					)}
				</div>
			</Card>
		</motion.div>
	);
};

export default Foodentry;
