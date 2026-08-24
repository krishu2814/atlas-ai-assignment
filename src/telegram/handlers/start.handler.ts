import { Context } from "telegraf";
import { OnboardingController } from "../../controllers/onboarding.controller.js";

const onboardingController = new OnboardingController();

// class to handle the /start command from the user
export async function startHandler(c: Context) {
  try {
    if (!c.from) return;
    const response = await onboardingController.startOnboarding({
      telegramId: String(c.from.id),
      username: c.from.username,
      firstName: c.from.first_name,
      lastName: c.from.last_name,
    });

    await c.reply(response);
  } catch (error) {
    console.error("Start handler error:", error);
    await c.reply("Unable to start onboarding. Please try again.");
  }
}
