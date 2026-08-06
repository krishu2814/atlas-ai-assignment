import { Worker } from "bullmq";
import redis from "../../config/redis.js";
import { BRIEF_QUEUE_NAME } from "../../queue/queues/brief-queue.js";
import type { BriefJobData } from "../../types/queue.js";

import { BriefService } from "../../services/brief/brief.service.js";
import { logger } from "../../config/logger.js";
import { bot } from "../../telegram/bot.js";

export const briefWorker = new Worker<BriefJobData>(
  BRIEF_QUEUE_NAME,
  async (job) => {
    const briefService = new BriefService();

    const { telegramId } = job.data;

    logger.info(
      {
        jobId: job.id,
        telegramId,
      },
      "Processing daily brief",
    );

    const brief = await briefService.generateBrief(telegramId);

    await bot.telegram.sendMessage(telegramId, brief);

    logger.info(
      {
        telegramId,
      },
      "Daily brief sent",
    );
  },
  {
    connection: redis,
    concurrency: 5,
  },
);
