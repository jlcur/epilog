import express from "express";
import { authenticateUser } from "../../middleware/authenticate-user.ts";
import { validateRequest } from "../../middleware/validate.ts";
import { db } from "../../shared/database/database.ts";
import commentRouter from "../comment/comment-routes.ts";
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
const service = createPostService(repository);
const handlers = createPostHandlers(service);

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
	.route("/")
	.post(
		authenticateUser,
		validateRequest(createPostSchema),
		handlers.createPost,
	)
	.get(validateRequest(getAllPostsPaginatedSchema), handlers.getAllPosts);

export default router;
