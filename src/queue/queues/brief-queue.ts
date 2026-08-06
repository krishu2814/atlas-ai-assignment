import { Queue } from "bullmq";
import redis from "../../config/redis.js";

export const BRIEF_QUEUE_NAME = "daily-brief";

// creates a new queue for daily brief jobs
export const briefQueue = new Queue(BRIEF_QUEUE_NAME, {
  connection: redis,
});
