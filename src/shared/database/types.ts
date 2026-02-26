import type { ColumnType, Generated } from "kysely";

export interface CommentTable {
	id: Generated<string>;
	content: string;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, never, never>;
}

export interface Database {
	comments: CommentTable;
}
