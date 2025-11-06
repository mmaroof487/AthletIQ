import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Google from "../components/Google";

const Register = () => {
	const [generalError, setGeneralError] = useState(null);
	const clientUrl = import.meta.env.VITE_CLIENT_URL;
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm();

	const password = watch("password");

	const onSubmit = async (data) => {
		try {
			const response = await fetch(`${clientUrl}/auth/register`, {
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
				throw new Error(dataResponse.message || "Registration failed");
			}

			localStorage.setItem("token", dataResponse.token);
			localStorage.setItem("userId", dataResponse.user.id);

			navigate("/profile");
		} catch (error) {
			console.error("Registration error:", error);
			setGeneralError("Failed to register. Please try again.");
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<h1 className="text-3xl font-bold mb-1 text-center">Create Account</h1>
			<p className="text-gray-400 text-center mb-8">Join AthletIQ and start your fitness journey</p>

			{generalError && <div className="bg-error-500 bg-opacity-20 border border-error-500 rounded-lg p-4 mb-6 text-sm text-white">{generalError}</div>}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<Input
					type="text"
					label="Email"
					placeholder="john_doe@gmail.com"
					icon={<User size={18} />}
					error={errors.email?.message}
					{...register("email", {
						required: "email is required",
						minLength: {
							value: 3,
							message: "email must be at least 3 characters",
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

				<Input
					type="password"
					label="Confirm Password"
					placeholder="••••••••"
					icon={<Lock size={18} />}
					error={errors.confirmPassword?.message}
					{...register("confirmPassword", {
						required: "Please confirm your password",
						validate: (value) => value === password || "Passwords do not match",
					})}
				/>

				<Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} className="mt-6">
					Create Account
				</Button>
			</form>

			<Google setGeneralError={setGeneralError} clientUrl={clientUrl} />

			<div className="mt-8 text-center">
				<p className="text-gray-400">
					Already have an account?{" "}
					<Link to="/login" className="text-primary-500 hover:text-primary-400 transition-colors">
						Sign in
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default Register;
