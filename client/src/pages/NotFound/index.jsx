import { Link } from "react-router-dom";
import { Flame, Home } from "lucide-react";
import Button from "@/components/ui/Button";

const NotFound = () => {
	return (
		<div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
			<div className="text-center">
				<Flame size={80} className="text-primary-500 mx-auto mb-6" />

				<h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
				<h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>

				<p className="text-gray-400 mb-8 max-w-md mx-auto">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>

				<Link to="/dashboard">
					<Button variant="primary" icon={<Home size={18} />}>
						Return to Dashboard
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
