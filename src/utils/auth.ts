import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { db } from "../shared/database/database.ts";

const prefix = process.env.API_PREFIX || "/api/v1";

export const auth = betterAuth({
	database: {
		db: db,
		type: "postgres",
	},

	basePath: `${prefix}/auth`,

	emailAndPassword: {
		enabled: true,
	},

	plugins: [admin()],

	trustedOrigins: [process.env.CORS_ORIGIN || "http://localhost:3000"],
});
