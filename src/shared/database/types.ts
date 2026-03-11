import type { ColumnType, Generated } from "kysely";

export interface CommentTable {
	id: Generated<string>;
	content: string;
	created_at: ColumnType<Date, string | undefined, never>;
	updated_at: ColumnType<Date, never, never>;
	parent_id: string | null;
	is_deleted: Generated<boolean>;
}

interface UserTable {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

interface SessionTable {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

interface AccountTable {
	id: string;
	userId: string;
	accountId: string;
	providerId: string;
	accessToken?: string | null;
	refreshToken?: string | null;
	accessTokenExpiresAt?: Date | null;
	refreshTokenExpiresAt?: Date | null;
	scope?: string | null;
	password?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

interface VerificationTable {
	id: string;
	identifier: string;
	value: string;
	expiresAt: Date;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

export interface Database {
	comments: CommentTable;
	user: UserTable;
	session: SessionTable;
	account: AccountTable;
	verification: VerificationTable;
}
