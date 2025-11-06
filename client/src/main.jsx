import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const rootElement = document.getElementById("root");
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<GoogleOAuthProvider clientId={CLIENT_ID}>
				<App />
			</GoogleOAuthProvider>
		</StrictMode>
	);
}
