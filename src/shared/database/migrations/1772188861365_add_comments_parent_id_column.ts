import type { Kysely } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// 1. Add two columns: 'is_deleted' and 'parent_id' (parent_id references comments.id)
	await db.schema
		.alterTable("comments")
		.addColumn("is_deleted", "boolean", (col) => col.notNull().defaultTo(false))
		.addColumn("parent_id", "uuid", (col) => col.references("comments.id"))
		.execute();

	// 2. Add an index for performance
	await db.schema
		.createIndex("comments_parent_id_index")
		.on("comments")
		.column("parent_id")
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex("comments_parent_id_index").execute();
	await db.schema
		.alterTable("comments")
		.dropColumn("parent_id")
		.dropColumn("is_deleted")
		.execute();
}
