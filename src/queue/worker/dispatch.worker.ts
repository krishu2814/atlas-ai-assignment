import { Worker } from "bullmq";

import redis from "../../config/redis.js";
import { logger } from "../../config/logger.js";

import { DISPATCH_QUEUE_NAME } from "../queues/dispatch.queue.js";
import { briefQueue } from "../queues/brief-queue.js";

import { UserService } from "../../services/user/user.service.js";

const userService = new UserService();
// logger.info("✅ Dispatch Worker Started");
export const dispatchWorker = new Worker(
  DISPATCH_QUEUE_NAME,
  async (job) => {
    logger.info(
      {
        jobId: job.id,
      },
      "Starting morning dispatch job",
    );

    const users = await userService.getOnboardedUsers();

    logger.info(
      {
        totalUsers: users.length,
      },
      "Fetched onboarded users",
    );

    // add jobs to the brief queue for each onboarded user -> using addBulk to add multiple jobs at once
    await briefQueue.addBulk(
      users.map((user) => ({
        name: "daily-brief",
        data: {
          telegramId: user.telegramId!,
        },
        opts: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      })),
    );

    logger.info(
      {
        totalJobs: users.length,
      },
      "Successfully queued daily brief jobs",
    );
  },
  {
    connection: redis,
  },
);
