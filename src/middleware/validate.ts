import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import { ZodError } from "zod";

/**
 * Validates that the request query, params and body are valid
 * @param validator the Zod validation that will be used to validate the request
 */
export const validateRequest =
	(validator: ZodObject) =>
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		try {
			// We use parse to validate the request is valid
			const parsed = await validator.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			// Overwrite request object
			// if (parsed.body !== undefined) {
			// 	req.body = parsed.body;
			// }
			// if (parsed.query !== undefined) {
			// 	req.query = parsed.query as any;
			// }
			// if (parsed.params !== undefined) {
			// 	req.params = parsed.params as any;
			// }

			res.locals.body = parsed.body;
			res.locals.query = parsed.query;
			res.locals.params = parsed.params;

			// Validation was successfully continue
			next();
		} catch (error) {
			// If error is instance of ZodError then return error to client to show it to user
			if (error instanceof ZodError) {
				const errorMessages = error.issues.map((issue) => ({
					path: issue.path.join("."),
					message: issue.message,
				}));

				return res.status(400).send({
					status: 400,
					message: "Validation error",
					detail: errorMessages,
				});
			}

			// If error is not from zod then return generic error message
			next(error);
		}
	};
