import { betterAuth } from "better-auth";
import { db } from "../shared/database/database.ts";

export const auth = betterAuth({
	database: {
		db: db,
		type: "postgres",
	},

	emailAndPassword: {
		enabled: true,
	},

	trustedOrigins: ["http://localhost:3000"],
});
