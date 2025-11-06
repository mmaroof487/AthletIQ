import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Google = ({ setGeneralError, clientUrl }) => {
	const navigate = useNavigate();
	const handleGoogleSuccess = async (credentialResponse) => {
		try {
			const decoded = jwtDecode(credentialResponse.credential);
			const response = await fetch(`${clientUrl}/auth/google`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					email: decoded.email,
					name: decoded.name,
					imgUrl: decoded.picture,
				}),
			});

			const dataResponse = await response.json();
			if (!response.ok) {
				throw new Error(dataResponse.message || "Login failed");
			}

			localStorage.setItem("token", dataResponse.token);
			localStorage.setItem("userId", dataResponse.user.id);
			navigate("/profile");
		} catch (error) {
			setGeneralError(error.message || "Failed to login with Google. Please try again.");
		}
	};

	const handleGoogleError = () => {
		setGeneralError("Google login failed. Please try again or use email/password.");
	};

	return (
		<>
			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-600"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
				</div>
			</div>
			<div className="flex justify-center">
				<GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap={false} theme="filled_black" size="large" text="signin_with" shape="rectangular" />
			</div>
		</>
	);
};

export default Google;
