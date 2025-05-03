import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

client
	.connect()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection error", err.stack));

export default client;
