import { z } from "zod";

const configSchema = z.object({
	port: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
	env: z.enum(["development", "production", "test"]).default("development"),
	pino: z.object({
		level: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
	}),
	database: z.object({
		name: z.string(),
		host: z.string(),
		user: z.string(),
		password: z.string(),
		port: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
	}),
});

const config = configSchema.parse({
	port: process.env.PORT,
	env: process.env.NODE_ENV || "development",

	pino: {
		level: process.env.PINO_LOG_LEVEL,
	},

	database: {
		name: process.env.DB_NAME,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: process.env.DB_PORT || 5432,
	},
});

export default config;
