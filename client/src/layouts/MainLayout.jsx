import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, BarChart2, Dumbbell, User, BrainCircuit, Utensils, Users, LogOut, Menu, X, Flame } from "lucide-react";

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		navigate("/login");
	};

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
	const closeSidebar = () => setSidebarOpen(false);

	return (
		<div className="min-h-screen bg-dark-900 flex flex-col">
			{/* Header */}
			<header className="bg-dark-800 border-b border-dark-700 py-4 px-6 flex items-center justify-between">
				<div className="flex items-center">
					<button onClick={toggleSidebar} className="mr-4 p-1 rounded-lg hover:bg-dark-700 lg:hidden">
						{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					<NavLink to="/dashboard" className="flex items-center">
						<Flame size={28} className="text-primary-500 mr-2" />
						<span className="text-xl font-bold">AthletIQ</span>
					</NavLink>
				</div>
			</header>

			<div className="flex flex-1">
				{/* Sidebar - Mobile (overlay) */}
				{sidebarOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={closeSidebar} />}

				{/* Sidebar */}
				<motion.nav
					className={`
            fixed top-0 left-0 z-30 h-screen w-64 pt-20 bg-dark-800 border-r border-dark-700
            transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:h-auto lg:pt-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
					initial={false}>
					<div className="p-4 space-y-1">
						{[
							{ to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
							{ to: "/fitness-tracker", label: "Fitness Tracker", Icon: BarChart2 },
							{ to: "/workouts", label: "Workouts", Icon: Dumbbell },
							{ to: "/nutrition", label: "Nutrition", Icon: Utensils },
							{ to: "/profile", label: "Profile", Icon: User },
							{ to: "/chatbot", label: "FitnessAI", Icon: BrainCircuit },
							{ to: "/gym-management", label: "Gym Management", Icon: Users },
						].map(({ to, label, Icon }) => (
							<NavLink
								key={to}
								to={to}
								className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? "bg-primary-500 text-white" : "text-gray-300 hover:bg-dark-700"}
                `}
								onClick={closeSidebar}>
								<Icon size={20} />
								<span>{label}</span>
							</NavLink>
						))}

						<button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-dark-700">
							<LogOut size={20} />
							<span>Logout</span>
						</button>
					</div>
				</motion.nav>

				{/* Main Content */}
				<main className="flex-1 p-6 pt-4 pb-20 overflow-x-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
