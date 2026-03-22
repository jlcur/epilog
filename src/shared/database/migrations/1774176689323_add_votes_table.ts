import { type Kysely, sql } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// Add votes table
	await db.schema
		.createTable("votes")
		.addColumn("id", "uuid", (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`),
		)
		.addColumn("user_id", "text", (col) =>
			col.references("user.id").onDelete("cascade").notNull(),
		)
		.addColumn("post_id", "uuid", (col) =>
			col.references("posts.id").onDelete("cascade"),
		)
		.addColumn("comment_id", "uuid", (col) =>
			col.references("comments.id").onDelete("cascade"),
		)
		.addColumn("value", "smallint", (col) => col.notNull())
		.addColumn("created_at", "timestamptz", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamptz", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addCheckConstraint(
			"check_vote_target",
			sql`(post_id IS NOT NULL) != (comment_id IS NOT NULL)`,
		)
		.addCheckConstraint("check_vote_value", sql`(value IN (-1, 1))`)
		.addUniqueConstraint("user_id_post_id_unique", ["user_id", "post_id"])
		.addUniqueConstraint("user_id_comment_id_unique", ["user_id", "comment_id"])
		.execute();

	await sql`
        CREATE TRIGGER update_votes_updated_at
            BEFORE UPDATE ON votes
            FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("votes").ifExists().execute();
}
