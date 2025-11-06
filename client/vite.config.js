import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		cors: true,
		// Remove ALL headers - don't set any COOP or COEP headers
		hmr: {
			overlay: false,
		},
	},
});
