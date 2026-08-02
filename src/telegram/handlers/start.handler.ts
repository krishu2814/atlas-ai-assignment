import { Context } from "telegraf";
import { UserService } from "../../services/user/user.service.js";
import { OnboardingService } from "../../services/onboarding/onboarding.service.js";

export async function startHandler(c: Context) {
  if (!c.from) return;

  const userService = new UserService();
  const onboardingService = new OnboardingService();

  const user = await userService.getOrCreateUser({
    telegramId: String(c.from.id),
    username: c.from.username,
    firstName: c.from.first_name,
    lastName: c.from.last_name,
  });

  if (user.onboardingCompleted) {
    await c.reply(
      `👋 Welcome back ${user.firstName ?? "there"}! How can I help you today?`,
    );
    return;
  }

  const question = onboardingService.getCurrentQuestion(user);

  if (question) {
    await c.reply(question.question);
  }
}
