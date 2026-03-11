import type { Kysely } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// Add column 'user_id' to comments table (referencing user.id)
	await db.schema
		.alterTable("comments")
		.addColumn("user_id", "text", (col) =>
			col.references("user.id").onDelete("set null"),
		)
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable("comments").dropColumn("user_id").execute();
}
