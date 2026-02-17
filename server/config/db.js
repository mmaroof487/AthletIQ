import { Client } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server directory (up one level from config/)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

if (!process.env.DATABASE_URL) {
	console.error("DATABASE_URL is not defined in environment variables!");
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
		console.error("Detail:", err.message);
	});

export default client;
