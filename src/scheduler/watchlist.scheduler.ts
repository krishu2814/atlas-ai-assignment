import { logger } from "../config/logger.js";
import { watchlistDispatchQueue } from "../queue/queues/watchlist.queue.js";

export async function scheduleWatchlistMonitor() {
  await watchlistDispatchQueue.upsertJobScheduler(
    "watchlist-monitor-scheduler",
    {
      // Run every 2 hours during market days / intervals
      pattern: "0 */2 * * *",
    },
    {
      name: "watchlist-dispatch-job",
      data: {},
    },
  );

  logger.info("Watchlist Monitoring Scheduler Registered");
}
