import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "development" ? { rejectUnauthorized: false } : false,
});

client
	.connect()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection failed:", err));

export default client;
