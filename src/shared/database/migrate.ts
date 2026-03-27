import fs from "node:fs/promises";
import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { type Migration, type MigrationProvider, Migrator } from "kysely";
import { db } from "./database.ts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const require = createRequire(import.meta.url);

// FileMigrationProvider doesn't support .cjs files (produced when package.json
// has "type": "module" and tsup outputs cjs format), so we use a custom provider.
class CjsCompatibleMigrationProvider implements MigrationProvider {
	async getMigrations(): Promise<Record<string, Migration>> {
		const migrationFolder = path.join(__dirname, "migrations");
		const files = await fs.readdir(migrationFolder);
		const migrations: Record<string, Migration> = {};
		for (const fileName of files) {
			if (
				fileName.endsWith(".js") ||
				fileName.endsWith(".cjs") ||
				fileName.endsWith(".mjs") ||
				(fileName.endsWith(".ts") && !fileName.endsWith(".d.ts"))
			) {
				const migration = require(path.join(migrationFolder, fileName));
				const key = fileName.substring(0, fileName.lastIndexOf("."));
				migrations[key] = migration;
			}
		}
		return migrations;
	}
}

export async function migrateToLatest() {
	const migrator = new Migrator({
		db,
		provider: new CjsCompatibleMigrationProvider(),
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
