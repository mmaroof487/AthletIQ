import React from "react";
import { Outlet } from "react-router-dom";
import { Flame } from "lucide-react";

const AuthLayout = () => {
	return (
		<div className="min-h-screen flex">
			{/* Left side - Background image */}
			<div
				className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
				style={{
					backgroundImage: "url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
				}}>
				<div className="w-full h-full bg-black bg-opacity-60 flex flex-col justify-center items-center p-12">
					<Flame size={60} className="text-primary-500 mb-6" />
					<h1 className="text-4xl font-bold text-white mb-4">AthletIQ</h1>
					<p className="text-xl text-gray-200 text-center mb-8">Track your progress. Achieve your fitness goals. Transform your life.</p>
					<div className="space-y-4 text-gray-300">
						{["Advanced fitness tracking", "Personalized workout plans", "Nutrition monitoring", "Professional trainer support"].map((text, idx) => (
							<div key={idx} className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-primary-500 mr-2"></div>
								<p>{text}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="w-full lg:w-1/2 bg-dark-900 flex items-center justify-center p-6">
				<div className="w-full max-w-md">
					<div className="flex justify-center mb-8 lg:hidden">
						<Flame size={48} className="text-primary-500" />
					</div>

					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
