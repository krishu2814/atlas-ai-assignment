import { Queue } from "bullmq";
import redis from "../../config/redis.js";

export const WATCHLIST_DISPATCH_QUEUE_NAME = "watchlist-dispatch";
export const WATCHLIST_MONITOR_QUEUE_NAME = "watchlist-monitor";

export const watchlistDispatchQueue = new Queue(
  WATCHLIST_DISPATCH_QUEUE_NAME,
  {
    connection: redis,
  },
);

export const watchlistMonitorQueue = new Queue(
  WATCHLIST_MONITOR_QUEUE_NAME,
  {
    connection: redis,
  },
);
