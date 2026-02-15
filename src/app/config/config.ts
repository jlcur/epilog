import { z } from "zod";

const configSchema = z.object({
	port: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
	env: z.enum(["development", "production", "test"]).default("development"),
	pino: z.object({
		level: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
	}),
});

const config = configSchema.parse({
	port: process.env.PORT,
	env: process.env.NODE_ENV || "development",

	pino: {
		level: process.env.PINO_LOG_LEVEL,
	},
});

export default config;
