import type {
	CreateCommentInput,
	UpdateCommentInput,
} from "./comment-schema.ts";

export interface CommentEntity {
	id: string;
	content: string;
}

const comments: CommentEntity[] = [
	{ id: "1", content: "Hello, world!" },
	{ id: "2", content: "asdfaff" },
	{ id: "3", content: "Lorem ipsum dolor sit amet." },
];

export const createCommentRepository = () => ({
	/**
	 * Finds a comment by ID
	 * @param id
	 * @returns The comment
	 */
	async getComment(id: string) {
		return comments.find((comment) => comment.id === id);
	},
	/**
	 * Returns all comments
	 * @returns All comments
	 */
	async list() {
		return comments;
	},
	/**
	 * Creates a new comment
	 * @param data The comment data to create
	 * @returns The created comment
	 */
	async create(data: CreateCommentInput) {
		const newId = (comments.length + 1).toString();
		const newComment = { id: newId, ...data };
		comments.push(newComment);
		return newComment;
	},
	/**
	 * Deletes a comment by ID
	 * @param id The comment ID
	 * @returns True if comment was found and deleted, false if comment was not found
	 */
	async delete(id: string) {
		const index = comments.findIndex((comment) => comment.id === id);

		if (index === -1) {
			return false;
		}
		comments.splice(index, 1);
		return true;
	},
	/**
	 * Updates a comment by ID
	 * @param id The comment ID
	 * @param data Partial comment data to update with
	 * @returns Updated comment or null if not found
	 */
	async update(id: string, data: UpdateCommentInput) {
		const comment = await this.getComment(id);

		if (!comment) {
			return null;
		}

		if (data.content !== undefined) {
			comment.content = data.content;
		}

		return comment;
	},
});

export type CommentRepository = ReturnType<typeof createCommentRepository>;
