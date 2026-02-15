import type { ColumnType, Generated } from "kysely";

export interface CommentTable {
	id: Generated<string>;
	content: string;
	created_at: ColumnType<Date, string | undefined, never>;
}

export interface Database {
	comments: CommentTable;
}
