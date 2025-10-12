import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	user: process.env.DB_USER,
	host: process.env.DB_HOST || "postgres",
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT, 10),
});

client
	.connect()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection failed:", err));

export default client;
