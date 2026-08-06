import { Queue } from "bullmq";
import redis from "../../config/redis.js";

export const DISPATCH_QUEUE_NAME = "morning-dispatch";

export const dispatchQueue = new Queue(DISPATCH_QUEUE_NAME, {
  connection: redis,
});
