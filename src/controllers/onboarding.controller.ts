import { UserService } from "../services/user/user.service.js";
import { OnboardingService } from "../services/onboarding/onboarding.service.js";

export class OnboardingController {
  private readonly userService: UserService;
  private readonly onboardingService: OnboardingService;

  constructor() {
    this.userService = new UserService();
    this.onboardingService = new OnboardingService();
  }

  async startOnboarding(data: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<string> {
    const user = await this.userService.getOrCreateUser(data);

    if (user.onboardingCompleted) {
      return `👋 Welcome back ${user.firstName ?? "there"}! How can I help you today?`;
    }

    const question = this.onboardingService.getCurrentQuestion(user);

    return question?.question ?? "Welcome to Atlas AI!";
  }

  async restartOnboarding(telegramId: string): Promise<string> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      return "User not found. Please use /start first.";
    }
    await this.userService.resetOnboarding(user.id);
    const updatedUser = await this.userService.getById(user.id);
    const question = this.onboardingService.getCurrentQuestion(updatedUser!);

    return (
      "🔄 Let's update your profile.\n\n" +
      (question?.question ?? "Let's get started.")
    );
  }
}
