import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import FitnessTracker from "@/pages/FitnessTracker/index.";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Chatbot from "@/pages/Chatbot";
import GymManagement from "@/pages/GymManagement";
import NotFound from "@/pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }) => {
	const user = localStorage.getItem("user");

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }) => {
	const user = JSON.parse(localStorage.getItem("user"));

	if (!user || user.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
};

function App() {
	return (
		<Routes>
			{/* Auth routes */}
			<Route path="/" element={<AuthLayout />}>
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
			</Route>

			{/* Main protected routes */}
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="profile" element={<Profile />} />
				<Route path="fitness-tracker" element={<FitnessTracker />} />
				<Route path="workouts" element={<Workouts />} />
				<Route path="nutrition" element={<Nutrition />} />
				<Route path="chatbot" element={<Chatbot />} />
				<Route path="gym-management" element={<GymManagement />} />
			</Route>

			{/* Catch-all */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
