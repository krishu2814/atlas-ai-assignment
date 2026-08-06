import { Worker } from "bullmq";
import { bullMQConnection } from "../bullmq.js";
import type { MorningBriefJobData } from "../queues/morning.queue.js";
import { MorningJob } from "../jobs/morning.job.js";

const morningJob = new MorningJob();

export const morningWorker = new Worker<MorningBriefJobData>(
  "morning-brief",
  async (job) => {
    await morningJob.execute(job.data);
  },
  {
    connection: bullMQConnection,
    concurrency: 5,
  },
);

morningWorker.on("completed", (job) => {
  console.log(`✅ Morning job ${job.id} completed`);
});

morningWorker.on("failed", (job, error) => {
  console.error(`❌ Morning job ${job?.id} failed`, error);
});
