import { Worker } from "bullmq";
import redis from "../../config/redis.js";
import { WATCHLIST_MONITOR_QUEUE_NAME } from "../queues/watchlist.queue.js";
import type { WatchlistMonitorJobData } from "../../types/queue.js";
import { WatchlistService } from "../../services/finance/watchlist.service.js";
import { logger } from "../../config/logger.js";
import { bot } from "../../telegram/bot.js";

export const watchlistMonitorWorker = new Worker<WatchlistMonitorJobData>(
  WATCHLIST_MONITOR_QUEUE_NAME,
  async (job) => {
    const watchlistService = new WatchlistService();
    const { telegramId } = job.data;

    logger.info(
      {
        jobId: job.id,
        telegramId,
      },
      "Processing watchlist market evaluation",
    );

    const update = await watchlistService.evaluateUserWatchlist(telegramId);

    if (update) {
      await bot.telegram.sendMessage(telegramId, update);

      logger.info(
        {
          telegramId,
        },
        "Watchlist market update sent",
      );
    } else {
      logger.info(
        {
          telegramId,
        },
        "No watchlist update required",
      );
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);
