import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["src/server.ts"],
		format: ["cjs"],
		outDir: "dist",
		shims: true,
	},
	{
		entry: ["src/shared/database/migrations/*.ts"],
		format: ["cjs"],
		outDir: "dist/migrations",
	},
]);
