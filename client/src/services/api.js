import axios from "axios";

// Create axios instance with base URL
const axiosInstance = axios.create({
	baseURL: import.meta.env.DEV ? "http://localhost:5000/api" : "/api",
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Mock API responses for development
// In a real app, these would be actual API calls
const mockUser = {
	id: "1",
	name: "John Doe",
	email: "john@example.com",
	role: "member",
	avatarUrl: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120",
	membershipType: "Premium",
	membershipExpiry: "2024-12-31",
};

const mockTrainerUser = {
	id: "2",
	name: "Jane Smith",
	email: "jane@example.com",
	role: "trainer",
	avatarUrl: "https://images.pexels.com/photos/3757004/pexels-photo-3757004.jpeg?auto=compress&cs=tinysrgb&w=120",
};

const mockAdminUser = {
	id: "3",
	name: "Admin User",
	email: "admin@example.com",
	role: "admin",
};

// API service
export const api = {
	// Auth endpoints
	login: async (email, password) => {
		// In a real app, this would be an actual API call
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

		if (email === "john@example.com" && password === "password") {
			return { user: mockUser, token: "mock-token-member" };
		} else if (email === "jane@example.com" && password === "password") {
			return { user: mockTrainerUser, token: "mock-token-trainer" };
		} else if (email === "admin@example.com" && password === "password") {
			return { user: mockAdminUser, token: "mock-token-admin" };
		}

		throw new Error("Invalid credentials");
	},

	register: async (name, email) => {
		// In a real app, this would be an actual API call
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

		return {
			user: {
				id: "4",
				name,
				email,
				role: "member",
			},
			token: "mock-token-new-user",
		};
	},

	getCurrentUser: async () => {
		// In a real app, this would validate the token and return user data
		await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

		const token = localStorage.getItem("token");

		if (token === "mock-token-member") return mockUser;
		if (token === "mock-token-trainer") return mockTrainerUser;
		if (token === "mock-token-admin") return mockAdminUser;

		throw new Error("Invalid token");
	},

	updateProfile: async (userData) => {
		// In a real app, this would update user data on the server
		await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

		return { ...mockUser, ...userData };
	},

	// Fitness tracking endpoints
	getFitnessData: async () => {
		await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

		return {
			weight: [
				{ date: "2023-04-01", value: 96 },
				{ date: "2023-04-15", value: 95 },
				{ date: "2023-05-01", value: 94 },
				{ date: "2023-05-15", value: 84 },
				{ date: "2023-06-01", value: 86 },
				{ date: "2023-06-15", value: 87 },
			],
			calories: [
				{ date: "2023-06-10", value: 2800 },
				{ date: "2023-06-11", value: 2200 },
				{ date: "2023-06-12", value: 1700 },
				{ date: "2023-06-13", value: 3100 },
				{ date: "2023-06-14", value: 1800 },
				{ date: "2023-06-15", value: 2500 },
			],
			workouts: [
				{ date: "2023-06-10", duration: 45, type: "Strength" },
				{ date: "2023-06-12", duration: 30, type: "Cardio" },
				{ date: "2023-06-14", duration: 60, type: "CrossFit" },
			],
		};
	},

	// Gym management endpoints
	getMembers: async () => {
		await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

		return [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				membershipType: "Premium",
				membershipExpiry: "2024-12-31",
				joinDate: "2023-01-15",
			},
			{
				id: "4",
				name: "Alice Johnson",
				email: "alice@example.com",
				membershipType: "Standard",
				membershipExpiry: "2024-08-15",
				joinDate: "2023-02-20",
			},
			{
				id: "5",
				name: "Bob Williams",
				email: "bob@example.com",
				membershipType: "Basic",
				membershipExpiry: "2024-09-30",
				joinDate: "2023-03-10",
			},
		];
	},

	getTrainers: async () => {
		await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

		return [
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				specialization: "Strength Training",
				experience: "5 years",
			},
			{
				id: "6",
				name: "Mike Brown",
				email: "mike@example.com",
				specialization: "Yoga",
				experience: "8 years",
			},
			{
				id: "7",
				name: "Sarah Davis",
				email: "sarah@example.com",
				specialization: "Cardio",
				experience: "3 years",
			},
		];
	},
};

export default axiosInstance;
