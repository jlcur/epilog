import assert from "node:assert";
import { describe, it } from "node:test";
import type AppError from "../../shared/errors/AppError.ts";
import type { CommentEntity, CommentRepository } from "./comment-repository.ts";
import { createCommentService } from "./comment-service.ts";

describe("CommentService unit tests", () => {
	it("getComment: should return a comment if it exists", async () => {
		const mockComment = { id: "1", content: "Mock content" };

		const mockRepo: Partial<CommentRepository> = {
			getComment: async (id) => (id === "1" ? mockComment : undefined),
		};

		const service = createCommentService(mockRepo as CommentRepository);
		const result = await service.getComment("1");

		assert.strictEqual(result.id, "1");
		assert.strictEqual(result.content, "Mock content");
	});

	it("getComment: should throw AppError 404 if comment not found", async () => {
		const mockRepo: Partial<CommentRepository> = {
			getComment: async () => undefined,
		};

		const service = createCommentService(mockRepo as CommentRepository);

		await assert.rejects(
			async () => await service.getComment("999"),
			(err: AppError) => {
				assert.strictEqual(err.statusCode, 404);
				assert.strictEqual(err.message, "Comment not found");
				return true;
			},
		);
	});

	it("deleteComment: should throw 404 if repository returns false", async () => {
		const mockRepo: Partial<CommentRepository> = {
			delete: async () => false,
		};

		const service = createCommentService(mockRepo as CommentRepository);

		await assert.rejects(async () => await service.deleteComment("999"), {
			statusCode: 404,
			message: "Comment not found",
		});
	});

	it("listComments: should return an array of comments", async () => {
		const mockComments: CommentEntity[] = [
			{ id: "1", content: "First comment content" },
			{ id: "2", content: "Second comment content" },
		];

		const mockRepo: Partial<CommentRepository> = {
			list: async () => mockComments,
		};

		const service = createCommentService(mockRepo as CommentRepository);
		const result = await service.listComments();

		assert.strictEqual(result.length, 2);
		assert.deepStrictEqual(result, mockComments);
	});

	it("createComment: should call repository and return created comment", async () => {
		const mockComment = { content: "New comment content" };

		const mockRepo: Partial<CommentRepository> = {
			create: async (data) => ({ id: "999", ...data }),
		};

		const service = createCommentService(mockRepo as CommentRepository);
		const result = await service.createComment(mockComment);

		assert.strictEqual(result.id, "999");
		assert.strictEqual(result.content, "New comment content");
	});

	it("deleteComment: should resolve when repository returns true", async () => {
		const mockRepo: Partial<CommentRepository> = {
			delete: async (id) => id === "1",
		};

		const service = createCommentService(mockRepo as CommentRepository);

		// Should not throw
		await service.deleteComment("1");
	});

	it("deleteComment: should throw 404 when repository returns false", async () => {
		const mockRepo: Partial<CommentRepository> = {
			delete: async () => false,
		};

		const service = createCommentService(mockRepo as CommentRepository);

		await assert.rejects(
			async () => await service.deleteComment("non-existent"),
			{ statusCode: 404, message: "Comment not found" },
		);
	});

	it("updateComment: should return updated comment from repository", async () => {
		const updateData = { content: "Updated Content" };

		const mockRepo: Partial<CommentRepository> = {
			update: async (id, data) => ({ id, content: data.content! }),
		};

		const service = createCommentService(mockRepo as CommentRepository);
		const result = await service.updateComment("1", updateData);

		assert.strictEqual(result.id, "1");
		assert.strictEqual(result.content, "Updated Content");
	});

	it("updateComment: should throw 404 if repository returns null", async () => {
		const mockRepo: Partial<CommentRepository> = {
			update: async () => null,
		};

		const service = createCommentService(mockRepo as CommentRepository);

		await assert.rejects(
			async () =>
				await service.updateComment("invalid-id", { content: "test" }),
			{ statusCode: 404, message: "Comment not found" },
		);
	});
});
