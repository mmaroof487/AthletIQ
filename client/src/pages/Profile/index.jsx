import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CalendarDays, Settings, Trophy, Circle, Camera } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const clientUrl = import.meta.env.VITE_CLIENT_URL;

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const response = await fetch(`${clientUrl}/profile/${userId}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			setUser(data);
		} catch (err) {
			setError(err.message || "Failed to fetch user profile");
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			setError(null);
			const userId = localStorage.getItem("userId");

			const response = await fetch(`${clientUrl}/profile/update/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: data.name || user.user.name,
					phone: data.phone || user.user.phone_number,
					address: data.address || user.user.address,
					birthday: data.birthday || user.user.birthday,
					height: data.height || user.bodyMeasurement.height,
					weight: data.weight || user.bodyMeasurement.weight,
					fitnessGoal: data.fitnessGoal || user.user.fitnessgoal,
					gender: data.gender || user.bodyMeasurement.gender,
					imgurl: data?.imgurl || user.user?.imgurl,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			await fetchUserProfile();

			setUpdateSuccess(true);
			setTimeout(() => setUpdateSuccess(false), 5000);
			setEditing(false);
			window.location.reload();
		} catch (err) {
			console.error("Update profile error:", err);
			setError(err?.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};
	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="heading-1">Your Profile</h1>
				{!editing && (
					<Button variant="secondary" icon={<Settings size={18} />} onClick={() => setEditing(true)}>
						Edit Profile
					</Button>
				)}
			</div>

			{updateSuccess && (
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-success-500 bg-opacity-20 text-white p-4 rounded-lg border border-success-500">
					Profile updated successfully! Refresh to see the result!
				</motion.div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 lg:px-12">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<div className="flex flex-col md:flex-row items-center mb-6">
							<div className="mb-4 md:mb-0 md:mr-6">
								{user.user.imageurl ? (
									<img src={user.user.imageurl} alt={user.user.name} className="h-24 w-24 rounded-full object-cover border-4 border-primary-500" />
								) : (
									<div className="h-24 w-36 rounded-full bg-primary-500 flex items-center justify-center">
										<span className="text-white text-3xl font-bold">{user.user?.name?.charAt(0)}</span>
									</div>
								)}
							</div>

							<div className="text-center md:text-left">
								<h2 className="text-2xl font-bold">{user.user?.name}</h2>
								<p className="text-gray-400">{user.user?.email}</p>
								<div className="mt-2 flex flex-wrap justify-center md:justify-start">
									<span className="bg-primary-500 bg-opacity-20 text-primary-500 px-3 py-1 rounded-full text-sm mr-2 mb-2">
										{user?.role === "admin" ? "Admin" : user?.role === "trainer" ? "Trainer" : "Member"}
									</span>
									<span className="bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-sm mr-2 mb-2">{user.user.membershipType} Membership</span>
								</div>
							</div>
						</div>

						{editing ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input label="Full Name" icon={<User size={18} />} error={errors.name?.message} {...register("name")} placeholder={user.user?.name || ""} />
									<Input label="Email" type="email" icon={<Mail size={18} />} disabled {...register("email")} placeholder={user.user?.email || ""} />
									<Input label="Phone" icon={<Phone size={18} />} {...register("phone")} placeholder={user.user?.phone_number || ""} />
									<Input label="Address" icon={<MapPin size={18} />} {...register("address")} placeholder={user.user?.address || ""} />
									<Input label="Birthday" type="date" icon={<CalendarDays size={18} />} {...register("birthday")} placeholder={user.user?.birthday?.split("T")[0] || ""} />
									<Input label="Height(cm)" icon={<i className="text-lg">⇧</i>} {...register("height")} placeholder={user.bodyMeasurement?.height || ""} />
									<Input label="Initial Weight (kg)" type="number" min="0" icon={<i className="text-lg">⚖</i>} {...register("weight")} placeholder={user.bodyMeasurement?.weight || ""} />
									<Input label="Fitness Goal" icon={<Trophy size={18} />} {...register("fitnessGoal")} placeholder={user.user?.fitnessgoal || ""} />
									<Input label="Gender" icon={<Circle size={18} />} {...register("gender")} placeholder={user.bodyMeasurement?.gender || ""} />
									<Input label="Profile Image" icon={<Camera size={18} />} {...register("imgurl")} placeholder={user.user?.imgurl || "https://example.com/image.jpg"} />
								</div>

								<div className="mt-6 flex justify-end space-x-3">
									<Button type="button" variant="secondary" onClick={() => setEditing(false)}>
										Cancel
									</Button>
									<Button type="submit" variant="primary" isLoading={isSubmitting || loading}>
										Save Changes
									</Button>
								</div>
							</form>
						) : (
							<div>
								<h3 className="text-lg font-semibold mb-4">Personal Information</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-start">
										<User size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Full Name</p>
											<p>{user.user?.name}</p>
										</div>
									</div>
									<div className="flex items-start">
										<Mail size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Email</p>
											<p>{user.user?.email}</p>
										</div>
									</div>
									<div className="flex items-start">
										<Phone size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Phone</p>
											<p>{user.user?.phone_number}</p>
										</div>
									</div>
									<div className="flex items-start">
										<MapPin size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Address</p>
											<p>{user.user?.address}</p>
										</div>
									</div>
									<div className="flex items-start">
										<CalendarDays size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Birthday</p>
											<p>{user.user?.birthday?.split("T")[0]}</p>
										</div>
									</div>
									<div className="flex items-start">
										<i className="text-primary-500 mr-2 mt-1 text-lg">⇧</i>
										<div>
											<p className="text-sm text-gray-400">Height</p>
											<p>{user.bodyMeasurement?.height} cm</p>
										</div>
									</div>
									<div className="flex items-start">
										<i className="text-primary-500 mr-2 mt-1 text-lg">⚖</i>
										<div>
											<p className="text-sm text-gray-400">Initial Weight</p>
											<p>{user.bodyMeasurement?.weight} kg</p>
										</div>
									</div>
									<div className="flex items-start">
										<Trophy size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Fitness Goal</p>
											<p>{user.user?.fitnessgoal}</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Profile;
