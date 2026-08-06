import type { QueueOptions } from "bullmq";
import redis from "../config/redis.js";

export const bullMQConnection: QueueOptions["connection"] = redis;
