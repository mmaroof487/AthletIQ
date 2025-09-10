import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
		],
	},
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ index: true, element: <PrivateRoute element={<Dashboard />} /> },
			{ path: "dashboard", element: <PrivateRoute element={<Dashboard />} /> },
			{ path: "profile", element: <PrivateRoute element={<Profile />} /> },
			{ path: "fitness-tracker", element: <PrivateRoute element={<FitnessTracker />} /> },
			{ path: "workouts", element: <PrivateRoute element={<Workouts />} /> },
			{ path: "nutrition", element: <PrivateRoute element={<Nutrition />} /> },
			{ path: "chatbot", element: <PrivateRoute element={<Chatbot />} /> },
			{ path: "gym-management", element: <PrivateRoute element={<GymManagement />} /> },
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
