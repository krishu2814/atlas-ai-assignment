import { logger } from "../config/logger.js";
import { dispatchQueue } from "../queue/queues/dispatch.queue.js";

export async function scheduleMorningBrief() {
  //   logger.info("Registering Morning Brief Scheduler...");

  await dispatchQueue.upsertJobScheduler(
    "morning-dispatch",
    {
      pattern: "0 8 * * *",
    },
    {
      name: "morning-dispatch",
      data: {},
    },
  );

  logger.info("Morning Brief Scheduler Registered");
}
