import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Login = () => {
	const [generalError, setGeneralError] = useState(null);
	// const clientUrl = import.meta.env.VITE_CLIENT_URL;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			const response = await fetch(`https://server-ncmd.onrender.com/api/v1/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});

			const dataResponse = await response.json();

			if (!response.ok) {
				throw new Error(dataResponse.message || "Login failed");
			}

			localStorage.setItem("token", dataResponse.token);
			localStorage.setItem("userId", dataResponse.user.id);

			navigate("/dashboard");
		} catch (error) {
			setGeneralError(error.message || "Failed to login. Please try again.");
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<h1 className="text-3xl font-bold mb-1 text-center">Welcome Back</h1>
			<p className="text-gray-400 text-center mb-8">Login to access your AthletIQ account</p>

			{generalError && <div className="bg-error-500 bg-opacity-20 border border-error-500 rounded-lg p-4 mb-6 text-sm text-white">{generalError}</div>}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<Input
					type="email"
					label="Email"
					placeholder="you@example.com"
					icon={<Mail size={18} />}
					error={errors.email?.message}
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
				/>

				<Input
					type="password"
					label="Password"
					placeholder="••••••••"
					icon={<Lock size={18} />}
					error={errors.password?.message}
					{...register("password", {
						required: "Password is required",
						minLength: {
							value: 6,
							message: "Password must be at least 6 characters",
						},
					})}
				/>

				<div className="flex items-center justify-between text-sm">
					<label className="inline-flex items-center">
						<input type="checkbox" className="rounded border-gray-600 text-primary-500 focus:ring-primary-500" />
						<span className="ml-2 text-gray-300">Remember me</span>
					</label>

					<a href="#" className="text-primary-500 hover:text-primary-400 transition-colors">
						Forgot password?
					</a>
				</div>

				<Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} className="mt-6">
					Sign In
				</Button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-gray-400">
					Don't have an account?{" "}
					<Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors">
						Create one now
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default Login;
