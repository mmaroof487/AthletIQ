import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import FitnessTracker from "@/pages/FitnessTracker";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Chatbot from "@/pages/Chatbot";
import GymManagement from "@/pages/GymManagement";
import NotFound from "@/pages/NotFound";

import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthLayout />,
		children: [
			{ path: "login", element: <Login /> },
			{ path: "register", element: <Register /> },
			{ index: true, element: <Navigate to="/login" replace /> },
		],
	},

	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			},
			{
				path: "dashboard",
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			},
			{
				path: "profile",
				element: (
					<PrivateRoute>
						<Profile />
					</PrivateRoute>
				),
			},
			{
				path: "fitness-tracker",
				element: (
					<PrivateRoute>
						<FitnessTracker />
					</PrivateRoute>
				),
			},
			{
				path: "workouts",
				element: (
					<PrivateRoute>
						<Workouts />
					</PrivateRoute>
				),
			},
			{
				path: "nutrition",
				element: (
					<PrivateRoute>
						<Nutrition />
					</PrivateRoute>
				),
			},
			{
				path: "chatbot",
				element: (
					<PrivateRoute>
						<Chatbot />
					</PrivateRoute>
				),
			},
			{
				path: "gym-management",
				element: (
					<PrivateRoute>
						<GymManagement />
					</PrivateRoute>
				),
			},
		],
	},

	// 🔹 Catch-all
	{ path: "*", element: <NotFound /> },
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
