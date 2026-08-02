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
}
