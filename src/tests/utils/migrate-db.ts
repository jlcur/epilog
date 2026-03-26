import { promises as fs } from "node:fs";
import * as path from "node:path";
import { FileMigrationProvider, Migrator, sql } from "kysely";
import { db } from "../../shared/database/database.ts";

export async function migrateDb() {
	// Migrations reference user.id (better-auth's table). Create a stub so FK constraints resolve.
	await sql`CREATE TABLE IF NOT EXISTS "user" (id text PRIMARY KEY)`.execute(
		db,
	);

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(
				import.meta.dirname,
				"../../shared/database/migrations",
			),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}
}
