import { UserService } from "../services/user/user.service.js";
import { OnboardingService } from "../services/onboarding/onboarding.service.js";

export class ResetController {
  private readonly userService: UserService;
  private readonly onboardingService: OnboardingService;

  constructor() {
    this.userService = new UserService();
    this.onboardingService = new OnboardingService();
  }

  async resetProfile(telegramId: string): Promise<string> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      return "User not found.";
    }

    await this.userService.resetProfile(user.id);

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
