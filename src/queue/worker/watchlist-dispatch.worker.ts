import { Worker } from "bullmq";
import redis from "../../config/redis.js";
import { logger } from "../../config/logger.js";
import {
  WATCHLIST_DISPATCH_QUEUE_NAME,
  watchlistMonitorQueue,
} from "../queues/watchlist.queue.js";
import { WatchlistService } from "../../services/finance/watchlist.service.js";

const watchlistService = new WatchlistService();

export const watchlistDispatchWorker = new Worker(
  WATCHLIST_DISPATCH_QUEUE_NAME,
  async (job) => {
    logger.info(
      { jobId: job.id },
      "Starting watchlist dispatch job",
    );

    const users = await watchlistService.getUsersWithWatchlists();

    logger.info(
      { totalUsers: users.length },
      "Fetched users with active watchlists",
    );

    if (!users.length) {
      return;
    }

    await watchlistMonitorQueue.addBulk(
      users.map((user) => ({
        name: "watchlist-check",
        data: {
          telegramId: user.telegramId,
        },
        opts: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      })),
    );

    logger.info(
      { totalJobs: users.length },
      "Successfully queued watchlist monitor jobs",
    );
  },
  {
    connection: redis,
  },
);
