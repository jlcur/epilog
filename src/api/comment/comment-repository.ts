import type { Kysely } from "kysely";
import short from "short-uuid";
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

const translator = short.createTranslator();

export const createCommentRepository = (db: Kysely<Database>) => ({
	/**
	 * Finds a comment by ID
	 * @param id A shortened UUID
	 * @returns The comment
	 */
	async getComment(id: string) {
		const longId = translator.toUUID(id);

		const result = await db
			.selectFrom("comments")
			.selectAll()
			.where("id", "=", longId)
			.executeTakeFirst();

		return result
			? { ...result, id: translator.fromUUID(result.id) }
			: undefined;
	},
	/**
	 * Returns all comments
	 * @returns All comments
	 */
	async list() {
		const result = await db.selectFrom("comments").selectAll().execute();

		return result.map((row) => ({
			...row,
			id: translator.fromUUID(row.id),
		}));
	},
	/**
	 * Creates a new comment
	 * @param data The comment data to create
	 * @returns The created comment
	 */
	async create(data: CreateCommentInput) {
		const result = await db
			.insertInto("comments")
			.values({
				content: data.content,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return { ...result, id: translator.fromUUID(result.id) };
	},
	/**
	 * Deletes a comment by ID
	 * @param id The comment ID
	 * @returns True if comment was found and deleted, false if comment was not found
	 */
	async delete(id: string) {
		const longId = translator.toUUID(id);

		const result = await db
			.deleteFrom("comments")
			.where("id", "=", longId)
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

		const longId = translator.toUUID(id);

		const result =
			(await db
				.updateTable("comments")
				.set({ content: data.content })
				.where("id", "=", longId)
				.returningAll()
				.executeTakeFirst()) ?? null;

		return result ? { ...result, id: translator.fromUUID(result.id) } : null;
	},
});

export type CommentRepository = ReturnType<typeof createCommentRepository>;
