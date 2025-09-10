import bcrypt from "bcryptjs";
import client from "../config/db.js";
import { createToken } from "../utils/jwt.js";

export const register = async (req, res) => {
	const { email, password } = req.body;
	try {
		const existing = await client.query("SELECT * FROM member WHERE email = $1", [email]);
		if (existing.rows.length > 0) return res.status(400).json({ message: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await client.query("INSERT INTO member (email, password) VALUES ($1, $2) RETURNING *", [email, hashedPassword]);

		const token = createToken(result.rows[0]);
		res.status(201).json({ token, user: result.rows[0] });
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ message: "Registration failed" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const result = await client.query("SELECT * FROM member WHERE email = $1", [email]);
		if (result.rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

		const user = result.rows[0];
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

		const token = createToken(user);
		res.status(200).json({ token, user });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Login failed" });
	}
};
