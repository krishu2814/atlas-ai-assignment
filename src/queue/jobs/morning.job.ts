import type { MorningBriefJobData } from "../queues/morning.queue.js";

export class MorningJob {
  async execute(data: MorningBriefJobData): Promise<void> {
    console.log(`Generating morning brief for user ${data.userId}`);

    // TODO:
    // Later we'll call BriefService.sendMorningBrief()
  }
}
