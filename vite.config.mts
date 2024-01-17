import path from "node:path";

import { defineConfig } from "vitest/config";

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
