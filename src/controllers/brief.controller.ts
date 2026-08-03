import { BriefService } from "../services/brief/brief.service.js";

export class BriefController {
  private readonly briefService: BriefService;

  constructor() {
    this.briefService = new BriefService();
  }

  async generateBrief(telegramId: string): Promise<string> {
    return this.briefService.generateBrief(telegramId);
  }
}
