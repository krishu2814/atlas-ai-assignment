import { Queue } from "bullmq";
import { bullMQConnection } from "../bullmq.js";

export interface MorningBriefJobData {
  userId: string;
}

export const morningQueue = new Queue<MorningBriefJobData>("morning-brief", {
  connection: bullMQConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000,
    attempts: 3,
  },
});
