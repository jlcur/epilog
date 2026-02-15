import { pino } from "pino";
import config from "../../app/config/config.ts";

const logger = pino({
	level: config.pino.level || "info",
	transport: {
		target: "pino-pretty",
	},
});

export default logger;
