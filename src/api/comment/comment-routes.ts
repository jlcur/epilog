import express from "express";
import { authenticateUser } from "../../middleware/authenticate-user.ts";
import { validateRequest } from "../../middleware/validate.ts";
import { db } from "../../shared/database/database.ts";
import { createCommentHandlers } from "./comment-handler.ts";
import { createCommentRepository } from "./comment-repository.ts";
import {
	createCommentSchema,
	getCommentByIdSchema,
	getCommentsOnPostSchema,
	updateCommentSchema,
} from "./comment-schema.ts";
import { createCommentService } from "./comment-service.ts";

const router = express.Router({ mergeParams: true });

const repository = createCommentRepository(db);
const service = createCommentService(repository);
const handlers = createCommentHandlers(service);

router
	.route("/:commentId")
	.get(validateRequest(getCommentByIdSchema), handlers.getCommentById)
	.delete(
		authenticateUser,
		validateRequest(getCommentByIdSchema),
		handlers.deleteComment,
	)
	.patch(
		authenticateUser,
		validateRequest(updateCommentSchema),
		handlers.updateComment,
	);

router
	.route("/")
	.get(validateRequest(getCommentsOnPostSchema), handlers.getAllComments)
	.post(
		authenticateUser,
		validateRequest(createCommentSchema),
		handlers.createComment,
	);

export default router;
