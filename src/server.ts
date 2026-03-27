import { app } from "./app/app.ts";
import config from "./app/config/config.ts";
import { migrateToLatest } from "./shared/database/migrate.ts";
import logger from "./shared/logging/logger.ts";
import { auth } from "./utils/auth.ts";

(async () => {
	await migrateToLatest();
	const ctx = await auth.$context;
	await ctx.runMigrations();

	// biome-ignore lint/suspicious/noImplicitAnyLet: server
	let server;
	server = app.listen(config.port, () => {
		logger.info(`Listening on port ${config.port}`);
	});

	process.on("uncaughtException", (error) => {
		logger.error(error);

		if (server) {
			server.close(() => {
				logger.info("Server closed");
				process.exit(1);
			});
		} else {
			process.exit(1);
		}
	});

	process.on("SIGTERM", () => {
		logger.fatal("SIGTERM received");
		if (server) {
			server.close();
		}
	});
})();
