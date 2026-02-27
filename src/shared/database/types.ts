import type { ColumnType, Generated } from "kysely";

export interface CommentTable {
	id: Generated<string>;
	content: string;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, never, never>;
	parent_id: string | null;
	is_deleted: boolean;
}

export interface Database {
	comments: CommentTable;
}
