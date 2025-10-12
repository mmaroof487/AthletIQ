import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CalendarDays, Settings, Trophy, Circle, Camera, PersonStanding } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const Profile = () => {
	const [editing, setEditing] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [profile, setProfile] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		birthday: "",
		height: "",
		weight: "",
		fitnessGoal: "",
		gender: "",
		imgurl: "",
	});
	const clientUrl = import.meta.env.VITE_CLIENT_URL;
	//*add activity level to profile state
	//! this page opens from register as well when no data is fetched in dashboard
	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");

			const response = await fetch(`${clientUrl}/user/profile/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setProfile({
				name: data[0]?.name || "",
				email: data[0]?.email || "",
				phone: data[0]?.phone_number || "",
				address: data[0]?.address || "",
				birthday: data[0]?.birthday || "",
				height: data[1]?.height || "",
				weight: data[1]?.weight || "",
				fitnessGoal: data[0]?.fitnessgoal || "",
				gender: data[1]?.gender || "",
				imgurl: data[0]?.imageurl,
			});
			setLoading(false);
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			console.log(data[0]);
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
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			const response = await fetch(`${clientUrl}/user/profile/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					userId,
					name: data.name || profile.name,
					phone: data.phone || profile.phone,
					address: data.address || profile.address,
					birthday: data.birthday || profile.birthday,
					height: data.height || profile.height,
					weight: data.weight || profile.weight,
					fitnessGoal: data.fitnessGoal || profile.fitnessGoal,
					gender: data.gender || profile.gender,
					imgurl: data?.imgurl || profile.imgurl || "",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}
			await fetchUserProfile();
			setUpdateSuccess(true);
			setEditing(false);
			setTimeout(() => setLoading(false), 2000);
		} catch (err) {
			console.error("Update profile error:", err);
			setError(err?.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
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
					Profile updated successfully!
				</motion.div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-1 gap-6 lg:px-12">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<div className="flex flex-col md:flex-row items-center mb-4">
							<div className="mb-4 md:mb-0 md:mr-6">
								{profile?.imgurl !== "" || profile?.imgur !== null ? (
									<img src={profile?.imgurl} alt={profile?.name} className="h-24 w-24 rounded-full object-cover border-4 border-primary-500" />
								) : (
									<div className="h-24 w-36 rounded-full bg-primary-500 flex items-center justify-center">
										<span className="text-white text-3xl font-bold">{profile?.name?.charAt(0)}</span>
									</div>
								)}
							</div>

							<div className="text-center md:text-left">
								<h2 className="text-2xl font-bold">{profile?.name}</h2>
								<p className="text-gray-400">{profile?.email} blah</p>
							</div>
						</div>

						{editing ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
									<Input label="Full Name" icon={<User size={18} />} error={errors.name?.message} {...register("name")} placeholder={profile?.name || ""} />
									<Input label="Email" type="email" icon={<Mail size={18} />} disabled {...register("email")} placeholder={profile?.email || ""} />
									<Input label="Phone" icon={<Phone size={18} />} {...register("phone")} placeholder={profile?.phone || ""} />
									<Input label="Address" icon={<MapPin size={18} />} {...register("address")} placeholder={profile?.address || ""} />
									<Input label="Birthday" type="date" icon={<CalendarDays size={18} />} {...register("birthday")} defaultValue={profile?.birthday ? profile.birthday.split("T")[0] : ""} />
									<Input label="Height(cm)" icon={<i className="text-lg">⇧</i>} {...register("height")} placeholder={profile?.height || ""} />
									<Input label="Initial Weight (kg)" type="number" min="0" icon={<i className="text-lg">⚖</i>} {...register("weight")} placeholder={profile?.weight || ""} />
									<Select
										label="Fitness Goal"
										icon={<PersonStanding size={18} />}
										{...register("fitnessGoal")}
										defaultValue={profile?.fitnessGoal || ""}
										options={[
											{ value: "Maintaining", label: "Maintaining" },
											{ value: "Cutting", label: "Cutting" },
											{ value: "Bulking", label: "Bulking" },
										]}
									/>
									<Select
										label="Gender"
										icon={<PersonStanding size={18} />}
										{...register("gender")}
										defaultValue={profile?.gender || ""}
										options={[
											{ value: "male", label: "Male" },
											{ value: "female", label: "Female" },
											{ value: "other", label: "Other" },
										]}
									/>
									<Input label="Profile Image" icon={<Camera size={18} />} {...register("imgurl")} placeholder={profile?.imgurl || "https://example.com/image.jpg"} />
								</div>

								<div className="mt-4 flex justify-end space-x-3">
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
											<p>{profile?.name}</p>
										</div>
									</div>
									<div className="flex items-start">
										<Mail size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Email</p>
											<p>{profile?.email}</p>
										</div>
									</div>
									<div className="flex items-start">
										<Phone size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Phone</p>
											<p>{profile?.phone}</p>
										</div>
									</div>
									<div className="flex items-start">
										<MapPin size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Address</p>
											<p>{profile?.address}</p>
										</div>
									</div>
									<div className="flex items-start">
										<CalendarDays size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Birthday</p>
											<p>{profile?.birthday.split("T")[0]}</p>
										</div>
									</div>
									<div className="flex items-start">
										<i className="text-primary-500 mr-2 mt-1 text-lg">⇧</i>
										<div>
											<p className="text-sm text-gray-400">Height</p>
											<p>{profile?.height} cm</p>
										</div>
									</div>
									<div className="flex items-start">
										<i className="text-primary-500 mr-2 mt-1 text-lg">⚖</i>
										<div>
											<p className="text-sm text-gray-400">Initial Weight</p>
											<p>{profile?.weight} kg</p>
										</div>
									</div>
									<div className="flex items-start">
										<Trophy size={18} className="text-primary-500 mr-2 mt-1" />
										<div>
											<p className="text-sm text-gray-400">Fitness Goal</p>
											<p>{profile?.fitnessGoal}</p>
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
