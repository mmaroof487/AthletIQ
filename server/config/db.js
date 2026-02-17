import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error("DATABASE_URL is not defined in environment variables!");
} else {
	console.log("Connecting to database on port:", process.env.DATABASE_URL.split(":").pop().split("/")[0]);
}

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

client
	.connect()
	.then(() => console.log("Database connected successfully"))
	.catch((err) => {
		console.error("Database connection failed!");
		console.error("Error Code:", err.code);
		console.error("Address:", err.address);
		console.error("Port:", err.port);
		console.error("Detail:", err.message);
	});

export default client;
