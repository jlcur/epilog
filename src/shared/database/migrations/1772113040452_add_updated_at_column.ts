import { type Kysely, sql } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	// 1. Add the updated_at column
	await db.schema
		.alterTable("comments")
		.addColumn("updated_at", "timestamptz", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	// 2. Create trigger function to update 'updated_at' column
	await sql`
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    `.execute(db);

	// 3. Create the trigger so that the function runs on every modification of the 'comments' table
	await sql`
        CREATE TRIGGER update_comments_updated_at
        BEFORE UPDATE ON comments
        FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
    `.execute(db);
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	// 1. Drop the trigger
	await sql`DROP TRIGGER IF EXISTS update_comments_updated_at ON comments`.execute(
		db,
	);

	// 2. Drop the 'updated_at' column
	await db.schema.alterTable("comments").dropColumn("updated_at").execute();
}
