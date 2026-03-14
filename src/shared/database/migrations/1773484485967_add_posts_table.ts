import { type Kysely, sql } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// 1. Add posts table
	await db.schema
		.createTable("posts")
		.addColumn("id", "uuid", (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`),
		)
		.addColumn("title", "text", (col) => col.notNull())
		.addColumn("content", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamptz", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("user_id", "text", (col) =>
			col.references("user.id").onDelete("set null"),
		)
		.addColumn("updated_at", "timestamptz", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	// 2. Create the trigger so that the function runs on every modification of the 'posts' table
	await sql`
        CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON posts
        FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    `.execute(db);

	// 3. Add 'post_id' on comments table
	await db.schema
		.alterTable("comments")
		.addColumn("post_id", "uuid", (col) =>
			col.references("posts.id").onDelete("cascade"),
		)
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	// 1. Drop the 'post_id' column on comments table
	await db.schema.alterTable("comments").dropColumn("post_id").execute();

	// 2. Drop the trigger
	await sql`DROP TRIGGER IF EXISTS update_posts_updated_at ON posts`.execute(
		db,
	);

	// 3. Drop the posts table
	await db.schema.dropTable("posts").execute();
}
