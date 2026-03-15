import type { Kysely } from "kysely";
import short from "short-uuid";
import type { Database } from "../../shared/database/types.ts";
import type { CreatePostInput, UpdatePostInput } from "./post-schema.ts";

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
	async create(data: CreatePostInput & { userId: string | null }) {
		const result = await db
			.insertInto("posts")
			.values({
				title: data.title,
				content: data.content,
				user_id: data.userId,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return { ...result, id: translator.fromUUID(result.id) };
	},
	async list(page: number, limit: number) {
		const offset = (page - 1) * limit;

		const posts = await db
			.selectFrom("posts")
			.leftJoin("user", "posts.user_id", "user.id")
			.selectAll("posts")
			.select("user.name as user_name")
			.orderBy("posts.created_at", "desc")
			.limit(limit)
			.offset(offset)
			.execute();

		const { count } = await db
			.selectFrom("posts")
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.executeTakeFirstOrThrow();

		const total = Number(count);
		const totalPages = Math.ceil(total / limit);

		const postsWithConvertedIds = posts.map((row) => ({
			...row,
			id: translator.fromUUID(row.id),
		}));

		return {
			total,
			page,
			totalPages,
			results: postsWithConvertedIds,
		};
	},
	async delete(id: string) {
		const longId = translator.toUUID(id);

		return await db
			.deleteFrom("posts")
			.where("posts.id", "=", longId)
			.execute();
	},
	async update(id: string, data: UpdatePostInput) {
		if (!data.content && !data.title) return null;

		const longId = translator.toUUID(id);

		const result =
			(await db
				.updateTable("posts")
				.set({ title: data.title, content: data.content })
				.where("id", "=", longId)
				.returningAll()
				.executeTakeFirst()) ?? null;

		return result ? { ...result, id: translator.fromUUID(result.id) } : null;
	},
});

export type PostRepository = ReturnType<typeof createPostRepository>;
