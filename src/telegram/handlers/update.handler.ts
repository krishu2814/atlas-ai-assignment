import { Context } from "telegraf";
import { OnboardingController } from "../../controllers/onboarding.controller.js";

const onboardingController = new OnboardingController();

export async function updateHandler(c: Context): Promise<void> {
  if (!c.from) return;
  const response = await onboardingController.restartOnboarding(
    String(c.from.id),
  );

  await c.reply(response);
}
