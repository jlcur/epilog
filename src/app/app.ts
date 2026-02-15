import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { handleError } from "../middleware/error-handler.ts";
import logger from "../shared/logging/logger.ts";
import { router } from "./routes.ts";

export const app = express();

// Set HTTP security headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Request logging
app.use(
	pinoHttp({
		logger,
	}),
);

app.use("/v1", router);

app.get("/", (_req: Request, res: Response) => {
	res.send("Hello, world!");
});

app.use(handleError);
