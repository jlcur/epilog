import express from "express";
import { validateRequest } from "../../middleware/validate.ts";
import { createCommentHandlers } from "./comment-handler.ts";
import { createCommentRepository } from "./comment-repository.ts";
import {
	createCommentSchema,
	getCommentByIdSchema,
	updateCommentSchema,
} from "./comment-schema.ts";
import { createCommentService } from "./comment-service.ts";

const router = express.Router();

const repository = createCommentRepository();
const service = createCommentService(repository);
const handlers = createCommentHandlers(service);

router
	.route("/:commentId")
	.get(validateRequest(getCommentByIdSchema), handlers.getCommentById)
	.delete(validateRequest(getCommentByIdSchema), handlers.deleteComment)
	.patch(validateRequest(updateCommentSchema), handlers.updateComment);

router
	.route("/")
	.get(handlers.getAllComments)
	.post(validateRequest(createCommentSchema), handlers.createComment);

export default router;
