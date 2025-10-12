import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }) => {
	const [isAuth, setIsAuth] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsAuth(!!token);
	}, []);

	if (isAuth === null) return null; // or a loader

	return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
