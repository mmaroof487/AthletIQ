import { Dumbbell, User, Heart } from "lucide-react";

const workoutCategories = [
	{ id: "strength", name: "Strength", icon: <Dumbbell size={18} /> },
	{ id: "cardio", name: "Cardio", icon: <Heart size={18} /> },
	{ id: "hiit", name: "HIIT", icon: <Dumbbell size={18} /> },
	{ id: "yoga", name: "Yoga", icon: <User size={18} /> },
	{ id: "crossfit", name: "CrossFit", icon: <Dumbbell size={18} /> },
];
export default workoutCategories;
