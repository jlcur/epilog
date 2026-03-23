import express from "express";
import { authenticateUser } from "../../middleware/authenticate-user.ts";
import { validateRequest } from "../../middleware/validate.ts";
import { db } from "../../shared/database/database.ts";
import commentRouter from "../comment/comment-routes.ts";
import { createVoteRepository } from "../vote/vote-repository.ts";
import { votePostSchema } from "../vote/vote-schema.ts";
import { createVoteService } from "../vote/vote-service.ts";
import { createPostHandlers } from "./post-handler.ts";
import { createPostRepository } from "./post-repository.ts";
import {
	createPostSchema,
	getAllPostsPaginatedSchema,
	getPostByIdSchema,
	updatePostSchema,
} from "./post-schema.ts";
import { createPostService } from "./post-service.ts";

const router = express.Router();

const repository = createPostRepository(db);
const voteRepository = createVoteRepository(db);
const service = createPostService(repository);
const voteService = createVoteService(voteRepository);
const handlers = createPostHandlers(service, voteService);

// Mount the comment router as a sub-resource
router.use("/:postId/comments", commentRouter);

router
	.route("/:postId")
	.get(validateRequest(getPostByIdSchema), handlers.getPostById)
	.delete(
		authenticateUser,
		validateRequest(getPostByIdSchema),
		handlers.deletePostById,
	)
	.patch(
		authenticateUser,
		validateRequest(updatePostSchema),
		handlers.updatePost,
	);

router
	.route("/:postId/vote")
	.post(
		authenticateUser,
		validateRequest(votePostSchema),
		handlers.togglePostVote,
	);

router
	.route("/")
	.post(
		authenticateUser,
		validateRequest(createPostSchema),
		handlers.createPost,
	)
	.get(
		authenticateUser,
		validateRequest(getAllPostsPaginatedSchema),
		handlers.getAllPosts,
	);

export default router;
