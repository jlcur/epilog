import express from "express";
import { validateRequest } from "../../middleware/validate.ts";
import { db } from "../../shared/database/database.ts";
import { createPostHandlers } from "./post-handler.ts";
import { createPostRepository } from "./post-repository.ts";
import { getPostByIdSchema } from "./post-schema.ts";
import { createPostService } from "./post-service.ts";

const router = express.Router();

const repository = createPostRepository(db);
const service = createPostService(repository);
const handlers = createPostHandlers(service);

router
	.route("/:postId")
	.get(validateRequest(getPostByIdSchema), handlers.getPostById);

export default router;
