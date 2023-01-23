import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
		coverage: {
			reporter: ["lcov"],
		},
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, "./src/"),
		},
	},
});
