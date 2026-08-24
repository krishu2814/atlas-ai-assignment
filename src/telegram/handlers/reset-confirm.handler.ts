import { Context } from "telegraf";
import { ResetController } from "../../controllers/reset.controller.js";

const resetController = new ResetController();

export async function resetYesHandler(ctx: Context) {
  try {
    await ctx.answerCbQuery();

    if (!ctx.from) return;

    const response = await resetController.resetProfile(String(ctx.from.id));

    await ctx.editMessageText(response);
  } catch (error) {
    console.error("Reset confirm error:", error);
    await ctx.reply("Unable to reset profile. Please try again.");
  }
}

export async function resetNoHandler(ctx: Context) {
  try {
    await ctx.answerCbQuery();

    await ctx.editMessageText("❌ Profile reset cancelled.");
  } catch (error) {
    console.error("Reset cancel error:", error);
  }
}
