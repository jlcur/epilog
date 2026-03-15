import express from "express";
import { authenticateUser } from "../../middleware/authenticate-user.ts";
import { validateRequest } from "../../middleware/validate.ts";
import { db } from "../../shared/database/database.ts";
import { createPostHandlers } from "./post-handler.ts";
import { createPostRepository } from "./post-repository.ts";
import {
	createPostSchema,
	getAllPostsPaginatedSchema,
	getPostByIdSchema,
} from "./post-schema.ts";
import { createPostService } from "./post-service.ts";

const router = express.Router();

const repository = createPostRepository(db);
const service = createPostService(repository);
const handlers = createPostHandlers(service);

router
	.route("/:postId")
	.get(validateRequest(getPostByIdSchema), handlers.getPostById)
	.delete(
		authenticateUser,
		validateRequest(getPostByIdSchema),
		handlers.deletePostById,
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
