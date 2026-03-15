import type { NextFunction, Request, Response } from "express";
import type AppError from "../shared/errors/AppError.ts";
import logger from "../shared/logging/logger.ts";

export const handleError = (
	err: AppError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const statusCode = err.statusCode ? err.statusCode : 500;
	logger.error({ message: err.message, stack: err.stack });

	const message =
		statusCode === 500 ? "Something went wrong, try again later" : err.message;

	res.status(statusCode).send({
		status: statusCode,
		message,
	});
};
