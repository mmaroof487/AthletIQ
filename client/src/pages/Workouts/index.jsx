import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Clock, User, Calendar, Heart, Plus, ArrowRight, X, MoreVertical, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const workoutCategories = [
	{ id: "strength", name: "Strength", icon: <Dumbbell size={18} /> },
	{ id: "cardio", name: "Cardio", icon: <Heart size={18} /> },
	{ id: "hiit", name: "HIIT", icon: <Dumbbell size={18} /> },
	{ id: "yoga", name: "Yoga", icon: <User size={18} /> },
	{ id: "crossfit", name: "CrossFit", icon: <Dumbbell size={18} /> },
];

const workoutPlans = [
	{
		id: 1,
		title: "Beginner Strength Program",
		level: "Beginner",
		duration: "4 weeks",
		frequency: "3x per week",
		focus: "Full Body",
		link: "https://muscleandstrength.com/sites/default/files/workouts/superstrength8weekstrengthbuildingworkout.pdf",
		image: "https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg?auto=compress&cs=tinysrgb&w=500",
		description: "Perfect for beginners looking to build a foundation of strength.",
	},
	{
		id: 2,
		title: "Advanced HIIT Challenge",
		level: "Advanced",
		duration: "8 weeks",
		frequency: "5x per week",
		focus: "Fat Loss",
		link: "https://www.muscleandstrength.com/sites/default/files/workouts/mnsfullbody.pdf",
		image: "https://images.pexels.com/photos/4162490/pexels-photo-4162490.jpeg?auto=compress&cs=tinysrgb&w=500",
		description: "High-intensity interval training to maximize calorie burn and improve cardiovascular fitness.",
	},
	{
		id: 3,
		title: "Muscle Building Program",
		level: "Intermediate",
		duration: "12 weeks",
		frequency: "4x per week",
		focus: "Hypertrophy",
		link: "https://www.muscleandstrength.com/sites/default/files/workouts/bulldozer3day_0.pdf",
		image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=500",
		description: "Focused on maximizing muscle growth through progressive overload.",
	},
];

const exerciseLibrary = [
	{
		id: 1,
		name: "Barbell Squat",
		category: "strength",
		primaryMuscle: "Quadriceps",
		difficulty: "Intermediate",
		image: "https://images.pexels.com/photos/4164769/pexels-photo-4164769.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/squat.html",
	},
	{
		id: 2,
		name: "Bench Press",
		category: "strength",
		primaryMuscle: "Chest",
		difficulty: "Intermediate",
		image: "https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html",
	},
	{
		id: 3,
		name: "Deadlift",
		category: "strength",
		primaryMuscle: "Back",
		difficulty: "Advanced",
		image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html",
	},
	{
		id: 4,
		name: "Pull-ups",
		category: "strength",
		primaryMuscle: "Back",
		difficulty: "Intermediate",
		image: "https://images.pexels.com/photos/4162504/pexels-photo-4162504.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/wide-grip-pull-up.html",
	},
	{
		id: 5,
		name: "Running",
		category: "cardio",
		primaryMuscle: "Full Body",
		difficulty: "Beginner",
		image: "https://images.pexels.com/photos/3760278/pexels-photo-3760278.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/wide-grip-pull-up.html",
	},
	{
		id: 6,
		name: "Crunches",
		category: "hiit",
		primaryMuscle: "Full Body",
		difficulty: "Intermediate",
		image: "https://images.pexels.com/photos/6456155/pexels-photo-6456155.jpeg?auto=compress&cs=tinysrgb&w=300",
		link: "https://www.muscleandstrength.com/exercises/sit-up.html",
	},
];

const upcomingWorkouts = [
	{
		id: 1,
		title: "Upper Body Strength",
		date: "2023-06-22T10:00:00",
		duration: 60,
		trainer: "Jane Smith",
		location: "Main Gym Floor",
		category: "strength",
	},
	{
		id: 2,
		title: "HIIT Cardio Session",
		date: "2023-06-24T16:30:00",
		duration: 45,
		trainer: "Mike Brown",
		location: "Studio 2",
		category: "hiit",
	},
	{
		id: 3,
		title: "Yoga Flow",
		date: "2023-06-25T09:00:00",
		duration: 75,
		trainer: "Sarah Davis",
		location: "Yoga Studio",
		category: "yoga",
	},
];

const Workouts = () => {
	const [activeTab, setActiveTab] = useState("plans");
	const [showAddWorkout, setShowAddWorkout] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredExercises = exerciseLibrary.filter((exercise) => {
		const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
		const matchesSearch = !searchTerm || exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || exercise.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesCategory && matchesSearch;
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
				<div>
					<h1 className="heading-1">Workouts</h1>
					<p className="text-gray-400 mt-1">Track, plan, and optimize your training</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-dark-700">
				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "plans" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("plans")}>
					Workout Plans
				</button>

				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "upcoming" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("upcoming")}>
					Upcoming Workouts
				</button>

				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "exercises" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("exercises")}>
					Exercise Library
				</button>
			</div>

			{/* Add Workout Form */}
			{showAddWorkout && (
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-semibold">Create New Workout</h3>
						<button onClick={() => setShowAddWorkout(false)} className="p-1 hover:bg-dark-700 rounded-full">
							<X size={20} />
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input label="Workout Title" placeholder="e.g., Upper Body Strength" />

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-200 mb-1">Workout Category</label>
							<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
								<option value="">Select a category</option>
								{workoutCategories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>

						<Input label="Date" type="date" placeholder="Select date" />

						<Input label="Time" type="time" placeholder="Select time" />

						<Input label="Duration (minutes)" type="number" placeholder="e.g., 60" />

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-200 mb-1">Trainer</label>
							<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
								<option value="">Select a trainer (optional)</option>
								<option value="1">Jane Smith</option>
								<option value="2">Mike Brown</option>
								<option value="3">Sarah Davis</option>
							</select>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-200 mb-1">Notes</label>
							<textarea
								className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
								rows={3}
								placeholder="Any additional notes about this workout"></textarea>
						</div>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						<Button variant="secondary" onClick={() => setShowAddWorkout(false)}>
							Cancel
						</Button>

						<Button variant="primary">Create Workout</Button>
					</div>
				</motion.div>
			)}

			{/* Workout Plans Tab */}
			{activeTab === "plans" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{workoutPlans.map((plan, index) => (
							<motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
								<Card className="h-full" hoverEffect>
									<div className="relative h-48 -mx-6 -mt-6 mb-4 rounded-t-xl overflow-hidden">
										<img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
										<div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
										<div className="absolute bottom-4 left-4">
											<span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">{plan.level}</span>
										</div>
									</div>

									<h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
									<p className="text-gray-400 text-sm mb-4">{plan.description}</p>

									<div className="grid grid-cols-2 gap-3 mb-4">
										<div className="flex items-center text-sm">
											<Clock size={16} className="text-primary-500 mr-2" />
											<span>{plan.duration}</span>
										</div>

										<div className="flex items-center text-sm">
											<Calendar size={16} className="text-primary-500 mr-2" />
											<span>{plan.frequency}</span>
										</div>

										<div className="flex items-center text-sm col-span-2">
											<Dumbbell size={16} className="text-primary-500 mr-2" />
											<span>Focus: {plan.focus}</span>
										</div>
									</div>

									<div className="mt-auto pt-4 border-t border-dark-700">
										<a href={plan.link} target="_blank" rel="noopener noreferrer">
											<Button variant="primary" fullWidth>
												View Plan
											</Button>
										</a>
									</div>
								</Card>
							</motion.div>
						))}
					</div>

					<Card title="Recommended Plans for You">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div className="flex bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-colors">
								<img src="https://images.pexels.com/photos/6550851/pexels-photo-6550851.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Weight Loss Plan" className="w-24 h-24 object-cover" />
								<div className="p-3">
									<h4 className="font-medium">8-Week Weight Loss</h4>
									<p className="text-xs text-gray-400 mb-2">Mixed cardio and strength</p>
									<div className="flex items-center text-primary-500 text-sm">
										<span>View Plan</span>
										<ArrowRight size={14} className="ml-1" />
									</div>
								</div>
							</div>

							<div className="flex bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-colors">
								<img src="https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Core Strength" className="w-24 h-24 object-cover" />
								<div className="p-3">
									<h4 className="font-medium">Core Strength</h4>
									<p className="text-xs text-gray-400 mb-2">4 weeks to stronger abs</p>
									<div className="flex items-center text-primary-500 text-sm">
										<span>View Plan</span>
										<ArrowRight size={14} className="ml-1" />
									</div>
								</div>
							</div>

							<div className="flex bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-colors">
								<img src="https://images.pexels.com/photos/6551136/pexels-photo-6551136.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Flexibility & Mobility" className="w-24 h-24 object-cover" />
								<div className="p-3">
									<h4 className="font-medium">Flexibility & Mobility</h4>
									<p className="text-xs text-gray-400 mb-2">Improve range of motion</p>
									<div className="flex items-center text-primary-500 text-sm">
										<span>View Plan</span>
										<ArrowRight size={14} className="ml-1" />
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Upcoming Workouts Tab */}
			{activeTab === "upcoming" && (
				<div className="space-y-6">
					<Card title="Today's Workout">
						{upcomingWorkouts[0] ? (
							<div className="bg-dark-700 p-4 rounded-lg">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between">
									<div>
										<div className="flex items-center">
											<div className="p-2 bg-primary-500 bg-opacity-20 rounded-lg mr-3">
												<Dumbbell size={20} className="text-primary-500" />
											</div>
											<h3 className="text-xl font-semibold">{upcomingWorkouts[0].title}</h3>
										</div>

										<div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
											<div className="flex items-center text-sm">
												<Clock size={16} className="text-primary-500 mr-2" />
												<span>{upcomingWorkouts[0].duration} min</span>
											</div>

											<div className="flex items-center text-sm">
												<User size={16} className="text-primary-500 mr-2" />
												<span>With {upcomingWorkouts[0].trainer}</span>
											</div>

											<div className="flex items-center text-sm">
												<Calendar size={16} className="text-primary-500 mr-2" />
												<span>
													{new Date(upcomingWorkouts[0].date).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>
									</div>

									<div className="mt-4 md:mt-0 flex space-x-3">
										<Button variant="secondary" size="sm">
											Reschedule
										</Button>

										<Button variant="primary" size="sm">
											Start Workout
										</Button>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-gray-400 mb-4">No workouts scheduled for today</p>
								<Button variant="primary" onClick={() => setShowAddWorkout(true)}>
									Schedule a Workout
								</Button>
							</div>
						)}
					</Card>

					<h2 className="heading-3 mt-6">Upcoming Schedule</h2>

					<div className="space-y-4">
						{upcomingWorkouts.map((workout, index) => (
							<motion.div
								key={workout.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-dark-800 rounded-lg border border-dark-700 p-4 hover:border-primary-500 transition-all">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between">
									<div className="flex items-start">
										<div className="flex-shrink-0 w-14 h-14 bg-dark-700 rounded-lg flex flex-col items-center justify-center mr-4 border border-dark-600">
											<span className="text-lg font-bold">{new Date(workout.date).getDate()}</span>
											<span className="text-xs text-gray-400">{new Date(workout.date).toLocaleString("default", { month: "short" })}</span>
										</div>

										<div>
											<h3 className="font-semibold text-lg">{workout.title}</h3>
											<div className="flex flex-wrap items-center mt-1">
												<div className="flex items-center text-sm mr-4">
													<Clock size={14} className="text-primary-500 mr-1" />
													<span>
														{new Date(workout.date).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</span>
												</div>

												<div className="flex items-center text-sm mr-4">
													<User size={14} className="text-primary-500 mr-1" />
													<span>{workout.trainer}</span>
												</div>

												<div className="flex items-center text-sm">
													<span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-1"></span>
													<span>{workout.location}</span>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-4 md:mt-0 flex items-center space-x-2">
										<div className="bg-primary-500 bg-opacity-20 text-primary-500 px-3 py-1 rounded-full text-xs">{workout.duration} min</div>

										<button className="p-2 hover:bg-dark-700 rounded-full transition-colors">
											<MoreVertical size={18} />
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					<div className="flex justify-center mt-6">
						<Button variant="outline" onClick={() => setShowAddWorkout(true)}>
							Schedule More Workouts
						</Button>
					</div>
				</div>
			)}

			{/* Exercise Library Tab */}
			{activeTab === "exercises" && (
				<div className="space-y-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
							<button
								className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === null ? "bg-primary-500 text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"}`}
								onClick={() => setSelectedCategory(null)}>
								All Exercises
							</button>

							{workoutCategories.map((category) => (
								<button
									key={category.id}
									className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
										selectedCategory === category.id ? "bg-primary-500 text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
									}`}
									onClick={() => setSelectedCategory(category.id)}>
									<span className="mr-1">{category.icon}</span>
									{category.name}
								</button>
							))}
						</div>

						<div className="w-full md:w-auto">
							<div className="relative">
								<Input placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

								<button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-dark-700 rounded-full">
									<Filter size={18} className="text-gray-400" />
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredExercises.map((exercise, index) => (
							<motion.div key={exercise.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
								<Card className="h-full" hoverEffect>
									<div className="flex h-full flex-col">
										<div className="relative h-40 -mx-6 -mt-6 mb-4 rounded-t-xl overflow-hidden">
											<img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
											<div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
											<div className="absolute bottom-3 left-3">
												<span className="bg-dark-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-medium">{exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}</span>
											</div>
										</div>

										<h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>

										<div className="grid grid-cols-2 gap-2 mb-4">
											<div className="flex items-center text-sm">
												<span className="text-primary-500 mr-2">Target:</span>
												<span>{exercise.primaryMuscle}</span>
											</div>

											<div className="flex items-center text-sm">
												<span className="text-primary-500 mr-2">Level:</span>
												<span>{exercise.difficulty}</span>
											</div>
										</div>

										<div className="mt-auto pt-4 border-t border-dark-700 flex items-center justify-between">
											<a href={exercise.link} target="_blank" rel="noopener noreferrer">
												<Button variant="primary" size="sm">
													How to
												</Button>
											</a>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>

					{filteredExercises.length === 0 && (
						<div className="text-center py-16">
							<p className="text-gray-400 mb-4">No exercises found matching your criteria</p>
							<Button
								variant="secondary"
								onClick={() => {
									setSelectedCategory(null);
									setSearchTerm("");
								}}>
								Reset Filters
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Workouts;
