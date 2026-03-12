import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth.ts";

// @ts-expect-error
export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!session) {
		return res.status(401).json({ message: "Access denied" });
	}

	res.locals.user = session.user;
	next();
};
