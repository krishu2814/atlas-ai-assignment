import { logger } from "../config/logger.js";
import { dispatchQueue } from "../queue/queues/dispatch.queue.js";

export async function scheduleMorningBrief() {
  //   logger.info("Registering Morning Brief Scheduler...");

  await dispatchQueue.upsertJobScheduler(
    "morning-dispatch",
    {
      // every minute
      pattern: "60 * 1000", // later 8 am -> "0 8 * * *"
    },
    {
      name: "morning-dispatch",
      data: {},
    },
  );

  logger.info("Morning Brief Scheduler Registered");
}
