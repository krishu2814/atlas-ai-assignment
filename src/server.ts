import app from "./app.js";
import { env } from "./config/env.js";
import { startTelegramBot } from "./telegram/index.js";
import { logger } from "./config/logger.js";

async function start() {
  try {
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });
    await startTelegramBot();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
