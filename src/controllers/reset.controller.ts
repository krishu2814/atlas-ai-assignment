import { UserService } from "../services/user/user.service.js";
import { OnboardingService } from "../services/onboarding/onboarding.service.js";
import { MemoryService } from "../services/memory/memory.service.js";
import { SemanticMemoryService } from "../services/semantic-memory/semantic-memory.service.js";

export class ResetController {
  private readonly userService: UserService;
  private readonly onboardingService: OnboardingService;
  private readonly memoryService: MemoryService;
  private readonly semanticMemoryService: SemanticMemoryService;

  constructor() {
    this.userService = new UserService();
    this.onboardingService = new OnboardingService();
    this.memoryService = new MemoryService();
    this.semanticMemoryService = new SemanticMemoryService();
  }

  async resetProfile(telegramId: string): Promise<string> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      return "User not found.";
    }

    // reset everything related to the user
    await this.userService.resetProfile(user.id);
    await this.memoryService.clear(user.id);
    await this.semanticMemoryService.clear(user.id);

    const updatedUser = await this.userService.getById(user.id);
    if (!updatedUser) {
      throw new Error("User not found after reset.");
    }

    const firstQuestion =
      this.onboardingService.getCurrentQuestion(updatedUser);

    return `✅ Your profile has been reset successfully.

Let's set up your profile again.

${firstQuestion?.question ?? ""}`;
  }
}
