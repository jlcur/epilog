import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { handleError } from "../middleware/error-handler.ts";
import logger from "../shared/logging/logger.ts";
import { auth } from "../utils/auth.ts";
import { router } from "./routes.ts";

export const app = express();

// Set HTTP security headers
app.use(helmet());

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);

app.all("/api/v1/auth/*any", toNodeHandler(auth));

// Parse JSON request body
app.use(express.json());

// Request logging
app.use(
	pinoHttp({
		logger,
	}),
);

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello, world!");
});

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
});

app.use(handleError);
