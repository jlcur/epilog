import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import config from "../../app/config/config.ts";
import type { Database } from "./types.ts";

const dialect = new PostgresDialect({
	pool: new Pool({
		database: config.database.name,
		host: config.database.host,
		user: config.database.user,
		password: config.database.password,
		port: config.database.port,
		max: 10,
	}),
});

export const db = new Kysely<Database>({
	dialect,
});
