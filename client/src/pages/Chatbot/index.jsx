import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { IoSend } from "react-icons/io5";
import Card from "@/components/ui/Card";

const Chatbot = () => {
	const [messages, setMessages] = useState([
		{
			type: "bot",
			content: "👋 Hi! Feel free to ask any questions about fitness, workouts, or nutrition. I'm here to help!",
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!inputMessage.trim()) return;

		const userMessage = {
			type: "user",
			content: inputMessage,
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputMessage("");
		setIsTyping(true);

		try {
			const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDLVzdO_BYSN9xKkc4br0VZHcjqlaDy2CU", {
				contents: [
					{
						parts: [
							{
								text: "medium length and precise, avoid using bold letters " + inputMessage,
							},
						],
					},
				],
			});

			const botReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

			setMessages((prev) => [...prev, { type: "bot", content: botReply }]);
		} catch (error) {
			console.error("API Error:", error);
			setMessages((prev) => [...prev, { type: "bot", content: "An error occurred. Please try again later." }]);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
			<Card title="FitnessAI" className="lg:h-[680px] flex flex-col">
				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4">
					{messages.map((message, index) => (
						<div key={index} className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
							<div className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${message.type === "user" ? "bg-primary-500 text-white" : "bg-dark-700 text-white"}`}>{message.content}</div>
						</div>
					))}
					{isTyping && (
						<div className="flex justify-start mb-4">
							<div className="bg-dark-700 rounded-lg p-3 flex space-x-2">
								{[0, 150, 300].map((delay, i) => (
									<div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
								))}
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<form onSubmit={handleSendMessage} className="p-4 bg-dark-700 rounded-b-xl">
					<div className="flex space-x-2">
						<input
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							placeholder="Type your message..."
							className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
						<button type="submit" disabled={!inputMessage.trim()} className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
							<IoSend size={20} />
						</button>
					</div>
				</form>
			</Card>
		</motion.div>
	);
};

export default Chatbot;
