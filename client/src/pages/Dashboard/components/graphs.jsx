import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { api } from "@/services/api";

const Graphs = ({ historyWeight, historyCalorie }) => {
	const weights = historyWeight.map((item) => item.value);
	const minWeight = Math.min(...weights) - 5 || 0;
	const maxWeight = Math.max(...weights) + 5 || 100;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
				<Card title="Weight Progress">
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={historyWeight} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" />
								<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
								<YAxis tick={{ fill: "#ccc" }} domain={[minWeight, maxWeight]} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
									labelStyle={{ color: "#fff" }}
									formatter={(value) => [`${value} kgs`, "Weight"]}
									labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
								/>
								<Line type="monotone" dataKey="value" stroke="#FF6B00" strokeWidth={3} dot={{ fill: "#FF6B00", r: 4 }} activeDot={{ fill: "#FF6B00", r: 6, stroke: "#fff", strokeWidth: 2 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</motion.div>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
				<Card title="Daily Calorie Intake">
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={historyCalorie} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" />
								<XAxis dataKey="date" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
								<YAxis tick={{ fill: "#ccc" }} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1e1e1e", border: "none", borderRadius: "8px" }}
									labelStyle={{ color: "#fff" }}
									formatter={(value) => [`${value} kcal`]}
									labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
								/>
								<Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</motion.div>
		</div>
	);
};

export default Graphs;
