import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";
import config from "./src/app/config/config.ts";

export default defineConfig({
	dialect: new PostgresDialect({
		pool: new Pool({
			database: config.database.name,
			host: config.database.host,
			user: config.database.user,
			password: config.database.password,
			port: config.database.port,
		}),
	}),
	migrations: {
		migrationFolder: "src/shared/database/migrations",
	},
});
