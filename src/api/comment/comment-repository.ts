import type { Kysely } from "kysely";
import type { Database } from "../../shared/database/types.ts";
import type {
	CreateCommentInput,
	UpdateCommentInput,
} from "./comment-schema.ts";

export interface CommentEntity {
	id: string;
	content: string;
	created_at: Date;
}

export const createCommentRepository = (db: Kysely<Database>) => ({
	/**
	 * Finds a comment by ID
	 * @param id
	 * @returns The comment
	 */
	async getComment(id: string) {
		return await db
			.selectFrom("comments")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	},
	/**
	 * Returns all comments
	 * @returns All comments
	 */
	async list() {
		return await db.selectFrom("comments").selectAll().execute();
	},
	/**
	 * Creates a new comment
	 * @param data The comment data to create
	 * @returns The created comment
	 */
	async create(data: CreateCommentInput) {
		return await db
			.insertInto("comments")
			.values({
				content: data.content,
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	},
	/**
	 * Deletes a comment by ID
	 * @param id The comment ID
	 * @returns True if comment was found and deleted, false if comment was not found
	 */
	async delete(id: string) {
		const result = await db
			.deleteFrom("comments")
			.where("id", "=", id)
			.executeTakeFirst();

		return Number(result.numDeletedRows) > 0;
	},
	/**
	 * Updates a comment by ID
	 * @param id The comment ID
	 * @param data Partial comment data to update with
	 * @returns Updated comment or null if not found
	 */
	async update(id: string, data: UpdateCommentInput) {
		if (!data.content) return null;

		return (
			(await db
				.updateTable("comments")
				.set({ content: data.content })
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirst()) ?? null
		);
	},
});

export type CommentRepository = ReturnType<typeof createCommentRepository>;
