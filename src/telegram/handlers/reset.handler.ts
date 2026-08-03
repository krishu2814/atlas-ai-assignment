import { Context, Markup } from "telegraf";

export async function resetHandler(c: Context) {
  await c.reply(
    `⚠️ This will erase your profile and restart onboarding.

Are you sure?`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Yes, Reset", "reset_yes"),
        Markup.button.callback("❌ Cancel", "reset_no"),
      ],
    ]),
  );
}
