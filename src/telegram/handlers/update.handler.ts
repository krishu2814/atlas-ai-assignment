import { Context } from "telegraf";
import { OnboardingController } from "../../controllers/onboarding.controller.js";

const onboardingController = new OnboardingController();

export async function updateHandler(c: Context): Promise<void> {
  try {
    if (!c.from) return;
    const response = await onboardingController.restartOnboarding(
      String(c.from.id),
    );

    await c.reply(response);
  } catch (error) {
    console.error("Update handler error:", error);
    await c.reply("Unable to restart profile update. Please try again.");
  }
}
