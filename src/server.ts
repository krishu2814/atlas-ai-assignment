import "./queue/worker/brief.worker.js";
import "./queue/worker/dispatch.worker.js";
import app from "./app.js";
import { env } from "./config/env.js";
import { startTelegramBot } from "./telegram/index.js";
import { logger } from "./config/logger.js";
import { scheduleMorningBrief } from "./scheduler/brief.scheduler.js";

async function start() {
  try {
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });
    await startTelegramBot();
    await scheduleMorningBrief();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
