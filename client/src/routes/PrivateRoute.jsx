// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
	const token = localStorage.getItem("token"); // or "user" depending on your login logic

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return element;
};

export default PrivateRoute;
