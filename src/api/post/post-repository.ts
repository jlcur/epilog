import type { Kysely } from "kysely";
import short from "short-uuid";
import type { Database } from "../../shared/database/types.ts";

export interface PostEntity {
	id: string;
	title: string;
	content: string;
	user_id: string | null;
	created_at: Date;
	updated_at: Date;
}

const translator = short.createTranslator();

export const createPostRepository = (db: Kysely<Database>) => ({
	async getPost(id: string) {
		const longId = translator.toUUID(id);

		const result = await db
			.selectFrom("posts")
			.leftJoin("user", "posts.user_id", "user.id")
			.where("posts.id", "=", longId)
			.selectAll("posts")
			.select("user.name as user_name")
			.executeTakeFirst();

		return result
			? {
					...result,
					id: translator.fromUUID(result.id),
				}
			: undefined;
	},
});

export type PostRepository = ReturnType<typeof createPostRepository>;
