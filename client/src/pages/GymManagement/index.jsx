import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, MoreVertical, Filter, ArrowDownAZ, ArrowUpZA, X, Check, Calendar, DollarSign } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/services/api";

const GymManagement = () => {
	const [activeTab, setActiveTab] = useState("members");
	const [members, setMembers] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddMember, setShowAddMember] = useState(false);
	const [showAddTrainer, setShowAddTrainer] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState("name");
	const [sortDirection, setSortDirection] = useState("asc");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [membersData, trainersData] = await Promise.all([api.getMembers(), api.getTrainers()]);

				setMembers(membersData);
				setTrainers(trainersData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const filteredMembers = members
		.filter(
			(member) =>
				member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			const valueA = a[sortField];
			const valueB = b[sortField];

			if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
			if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

	const filteredTrainers = trainers
		.filter(
			(trainer) =>
				trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			const valueA = a[sortField];
			const valueB = b[sortField];

			if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
			if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

	const dashboardData = {
		activeMemberships: 152,
		expiringThisMonth: 8,
		newMembersThisMonth: 14,
		revenue: {
			thisMonth: 12450,
			lastMonth: 11800,
			percentChange: 5.5,
		},
		membersByType: [
			{ type: "Premium", count: 35 },
			{ type: "Standard", count: 78 },
			{ type: "Basic", count: 39 },
		],
		upcomingClasses: [
			{ name: "CrossFit", time: "5:30 PM", trainer: "Mike Brown", enrolled: 12, capacity: 15 },
			{ name: "Yoga", time: "6:00 PM", trainer: "Sarah Davis", enrolled: 8, capacity: 20 },
			{ name: "HIIT", time: "7:15 PM", trainer: "Jane Smith", enrolled: 15, capacity: 15 },
		],
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
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
				<div>
					<h1 className="heading-1">Gym Management</h1>
					<p className="text-gray-400 mt-1">Manage your members, trainers, and gym operations</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<div className="flex items-center text-sm mr-4">
						<Calendar size={18} className="text-primary-500 mr-2" />
						<span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-dark-700">
				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "dashboard" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("dashboard")}>
					Dashboard
				</button>

				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "members" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("members")}>
					Members
				</button>

				<button
					className={`px-6 py-3 font-medium focus:outline-none ${activeTab === "trainers" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-400 hover:text-gray-300"}`}
					onClick={() => setActiveTab("trainers")}>
					Trainers
				</button>
			</div>

			{/* Dashboard Tab */}
			{activeTab === "dashboard" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
							<Card className="flex items-center">
								<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
									<Users size={24} className="text-primary-500" />
								</div>
								<div>
									<p className="text-gray-400 text-sm">Active Members</p>
									<p className="text-2xl font-bold">{dashboardData.activeMemberships}</p>
								</div>
							</Card>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
							<Card className="flex items-center">
								<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
									<DollarSign size={24} className="text-primary-500" />
								</div>
								<div>
									<p className="text-gray-400 text-sm">Monthly Revenue</p>
									<div className="flex items-baseline">
										<p className="text-2xl font-bold">${dashboardData.revenue.thisMonth}</p>
										<span className={`ml-2 text-sm ${dashboardData.revenue.percentChange >= 0 ? "text-success-500" : "text-error-500"}`}>
											{dashboardData.revenue.percentChange >= 0 ? "+" : ""}
											{dashboardData.revenue.percentChange}%
										</span>
									</div>
								</div>
							</Card>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
							<Card className="flex items-center">
								<div className="p-3 bg-primary-500 bg-opacity-20 rounded-lg mr-4">
									<UserPlus size={24} className="text-primary-500" />
								</div>
								<div>
									<p className="text-gray-400 text-sm">New Members This Month</p>
									<p className="text-2xl font-bold">{dashboardData.newMembersThisMonth}</p>
								</div>
							</Card>
						</motion.div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card title="Membership Distribution" className="lg:col-span-2">
							<div className="space-y-4">
								{dashboardData.membersByType.map((type, index) => (
									<div key={index}>
										<div className="flex justify-between items-center mb-1">
											<span>{type.type} Membership</span>
											<span className="text-sm text-gray-400">{type.count} members</span>
										</div>
										<div className="relative h-2 bg-dark-700 rounded-full overflow-hidden">
											<div
												className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
												style={{
													width: `${(type.count / dashboardData.activeMemberships) * 100}%`,
													opacity: 0.5 + 0.5 * (index / dashboardData.membersByType.length),
												}}></div>
										</div>
									</div>
								))}
							</div>

							<div className="mt-6">
								<h3 className="font-semibold mb-3">Membership Alerts</h3>
								<div className="bg-dark-700 rounded-lg p-4">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center">
											<span className="h-2 w-2 rounded-full bg-warning-500 mr-2"></span>
											<span>Memberships expiring this month</span>
										</div>
										<span className="font-semibold">{dashboardData.expiringThisMonth}</span>
									</div>

									<Button variant="outline" size="sm" fullWidth>
										View All Expiring Memberships
									</Button>
								</div>
							</div>
						</Card>

						<Card title="Today's Classes">
							<div className="space-y-3">
								{dashboardData.upcomingClasses.map((cls, index) => (
									<div key={index} className="bg-dark-700 rounded-lg p-3">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="font-medium">{cls.name}</h4>
												<p className="text-sm text-gray-400">
													{cls.time} with {cls.trainer}
												</p>
											</div>
											<div className={`px-2 py-1 rounded text-xs font-medium ${cls.enrolled === cls.capacity ? "bg-error-500 bg-opacity-20 text-error-500" : "bg-success-500 bg-opacity-20 text-success-500"}`}>
												{cls.enrolled}/{cls.capacity}
											</div>
										</div>
										<div className="mt-2 relative h-1 bg-dark-800 rounded-full overflow-hidden">
											<div
												className={`absolute top-0 left-0 h-full rounded-full ${cls.enrolled === cls.capacity ? "bg-error-500" : "bg-success-500"}`}
												style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}></div>
										</div>
									</div>
								))}

								<Button variant="outline" size="sm" fullWidth>
									View Full Schedule
								</Button>
							</div>
						</Card>
					</div>

					<Card title="Quick Actions">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Button
								variant="secondary"
								onClick={() => {
									setActiveTab("members");
									setShowAddMember(true);
								}}
								fullWidth>
								Add Member
							</Button>

							<Button
								variant="secondary"
								onClick={() => {
									setActiveTab("trainers");
									setShowAddTrainer(true);
								}}
								fullWidth>
								Add Trainer
							</Button>

							<Button variant="secondary" fullWidth>
								Create Class
							</Button>

							<Button variant="secondary" fullWidth>
								Send Announcement
							</Button>
						</div>
					</Card>
				</div>
			)}

			{/* Members Tab */}
			{activeTab === "members" && (
				<div className="space-y-6">
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="relative flex-grow max-w-md">
							<Input placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={18} />} />
						</div>

						<div className="flex gap-2">
							<Button variant="secondary" icon={<Filter size={18} />}>
								Filter
							</Button>

							<Button variant="primary" icon={<UserPlus size={18} />} onClick={() => setShowAddMember(true)}>
								Add Member
							</Button>
						</div>
					</div>

					<Card>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="text-left border-b border-dark-700">
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
											<div className="flex items-center">
												<span>Name</span>
												{sortField === "name" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("email")}>
											<div className="flex items-center">
												<span>Email</span>
												{sortField === "email" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("membershipType")}>
											<div className="flex items-center">
												<span>Membership</span>
												{sortField === "membershipType" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("membershipExpiry")}>
											<div className="flex items-center">
												<span>Expiry Date</span>
												{sortField === "membershipExpiry" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("joinDate")}>
											<div className="flex items-center">
												<span>Join Date</span>
												{sortField === "joinDate" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredMembers.map((member) => (
										<tr key={member.id} className="border-b border-dark-700 hover:bg-dark-800 transition-colors">
											<td className="px-6 py-4">{member.name}</td>
											<td className="px-6 py-4">{member.email}</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														member.membershipType === "Premium"
															? "bg-primary-500 bg-opacity-20 text-primary-500"
															: member.membershipType === "Standard"
															? "bg-blue-500 bg-opacity-20 text-blue-500"
															: "bg-gray-500 bg-opacity-20 text-gray-300"
													}`}>
													{member.membershipType}
												</span>
											</td>
											<td className="px-6 py-4">{new Date(member.membershipExpiry).toLocaleDateString()}</td>
											<td className="px-6 py-4">{new Date(member.joinDate).toLocaleDateString()}</td>
											<td className="px-6 py-4 text-right">
												<div className="inline-flex items-center space-x-2">
													<button className="text-gray-400 hover:text-white p-1">
														<MoreVertical size={18} />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{filteredMembers.length === 0 && <div className="text-center py-8 text-gray-400">No members found</div>}
						</div>
					</Card>
				</div>
			)}

			{/* Trainers Tab */}
			{activeTab === "trainers" && (
				<div className="space-y-6">
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="relative flex-grow max-w-md">
							<Input placeholder="Search trainers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<Search size={18} />} />
						</div>

						<div className="flex gap-2">
							<Button variant="secondary" icon={<Filter size={18} />}>
								Filter
							</Button>

							<Button variant="primary" icon={<UserPlus size={18} />} onClick={() => setShowAddTrainer(true)}>
								Add Trainer
							</Button>
						</div>
					</div>

					<Card>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="text-left border-b border-dark-700">
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
											<div className="flex items-center">
												<span>Name</span>
												{sortField === "name" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("email")}>
											<div className="flex items-center">
												<span>Email</span>
												{sortField === "email" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("specialization")}>
											<div className="flex items-center">
												<span>Specialization</span>
												{sortField === "specialization" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("experience")}>
											<div className="flex items-center">
												<span>Experience</span>
												{sortField === "experience" && (sortDirection === "asc" ? <ArrowDownAZ size={16} className="ml-1" /> : <ArrowUpZA size={16} className="ml-1" />)}
											</div>
										</th>
										<th className="px-6 py-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredTrainers.map((trainer) => (
										<tr key={trainer.id} className="border-b border-dark-700 hover:bg-dark-800 transition-colors">
											<td className="px-6 py-4">{trainer.name}</td>
											<td className="px-6 py-4">{trainer.email}</td>
											<td className="px-6 py-4">
												<span className="px-2 py-1 rounded-full text-xs bg-primary-500 bg-opacity-20 text-primary-500">{trainer.specialization}</span>
											</td>
											<td className="px-6 py-4">{trainer.experience}</td>
											<td className="px-6 py-4 text-right">
												<div className="inline-flex items-center space-x-2">
													<button className="text-gray-400 hover:text-white p-1">
														<MoreVertical size={18} />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{filteredTrainers.length === 0 && <div className="text-center py-8 text-gray-400">No trainers found</div>}
						</div>
					</Card>
				</div>
			)}

			{/* Add Member Dialog */}
			{showAddMember && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
					<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-dark-800 rounded-xl max-w-2xl w-full">
						<div className="p-6 border-b border-dark-700">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-bold">Add New Member</h2>
								<button onClick={() => setShowAddMember(false)} className="p-1 hover:bg-dark-700 rounded-full">
									<X size={24} />
								</button>
							</div>
						</div>

						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<Input label="Full Name" placeholder="Enter member's full name" />

								<Input label="Email" type="email" placeholder="Enter member's email" />

								<Input label="Phone Number" placeholder="Enter member's phone" />

								<Input label="Date of Birth" type="date" />

								<div className="mb-4 md:col-span-2">
									<label className="block text-sm font-medium text-gray-200 mb-1">Address</label>
									<textarea
										className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
										rows={2}
										placeholder="Enter member's address"></textarea>
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-200 mb-1">Membership Type</label>
									<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
										<option value="">Select membership type</option>
										<option value="premium">Premium</option>
										<option value="standard">Standard</option>
										<option value="basic">Basic</option>
									</select>
								</div>

								<Input label="Membership Duration" type="number" placeholder="Duration in months" />

								<Input label="Membership Start Date" type="date" />

								<Input label="Payment Amount" type="number" placeholder="Enter amount" />

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-200 mb-1">Payment Method</label>
									<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
										<option value="">Select payment method</option>
										<option value="credit">Credit Card</option>
										<option value="debit">Debit Card</option>
										<option value="cash">Cash</option>
										<option value="bank">Bank Transfer</option>
									</select>
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-200 mb-1">Assigned Trainer (Optional)</label>
									<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
										<option value="">Select trainer</option>
										{trainers.map((trainer) => (
											<option key={trainer.id} value={trainer.id}>
												{trainer.name} ({trainer.specialization})
											</option>
										))}
									</select>
								</div>

								<div className="md:col-span-2 flex items-center">
									<input id="send-welcome" type="checkbox" className="rounded border-gray-600 text-primary-500 focus:ring-primary-500" />
									<label htmlFor="send-welcome" className="ml-2 text-sm text-gray-300">
										Send welcome email to member
									</label>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-dark-700 flex justify-end space-x-3">
							<Button variant="secondary" onClick={() => setShowAddMember(false)}>
								Cancel
							</Button>

							<Button variant="primary" icon={<Check size={18} />} onClick={() => setShowAddMember(false)}>
								Add Member
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}

			{/* Add Trainer Dialog */}
			{showAddTrainer && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
					<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-dark-800 rounded-xl max-w-2xl w-full">
						<div className="p-6 border-b border-dark-700">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-bold">Add New Trainer</h2>
								<button onClick={() => setShowAddTrainer(false)} className="p-1 hover:bg-dark-700 rounded-full">
									<X size={24} />
								</button>
							</div>
						</div>

						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<Input label="Full Name" placeholder="Enter trainer's full name" />

								<Input label="Email" type="email" placeholder="Enter trainer's email" />

								<Input label="Phone Number" placeholder="Enter trainer's phone" />

								<Input label="Date of Birth" type="date" />

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-200 mb-1">Specialization</label>
									<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
										<option value="">Select specialization</option>
										<option value="strength">Strength Training</option>
										<option value="cardio">Cardio</option>
										<option value="yoga">Yoga</option>
										<option value="crossfit">CrossFit</option>
										<option value="pilates">Pilates</option>
										<option value="hiit">HIIT</option>
									</select>
								</div>

								<Input label="Experience (years)" type="number" placeholder="Years of experience" />

								<Input label="Hourly Rate" type="number" placeholder="Hourly rate" />

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-200 mb-1">Employment Type</label>
									<select className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
										<option value="">Select employment type</option>
										<option value="fulltime">Full Time</option>
										<option value="parttime">Part Time</option>
										<option value="contract">Contract</option>
									</select>
								</div>

								<div className="mb-4 md:col-span-2">
									<label className="block text-sm font-medium text-gray-200 mb-1">Bio</label>
									<textarea
										className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
										rows={3}
										placeholder="Enter trainer's bio"></textarea>
								</div>

								<div className="mb-4 md:col-span-2">
									<label className="block text-sm font-medium text-gray-200 mb-1">Certifications</label>
									<textarea
										className="w-full px-4 py-3 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
										rows={2}
										placeholder="Enter trainer's certifications"></textarea>
								</div>

								<div className="md:col-span-2 flex items-center">
									<input id="send-welcome-trainer" type="checkbox" className="rounded border-gray-600 text-primary-500 focus:ring-primary-500" />
									<label htmlFor="send-welcome-trainer" className="ml-2 text-sm text-gray-300">
										Send welcome email to trainer
									</label>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-dark-700 flex justify-end space-x-3">
							<Button variant="secondary" onClick={() => setShowAddTrainer(false)}>
								Cancel
							</Button>

							<Button variant="primary" icon={<Check size={18} />} onClick={() => setShowAddTrainer(false)}>
								Add Trainer
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default GymManagement;
