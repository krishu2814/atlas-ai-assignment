import { Context } from "telegraf";
import { ResetController } from "../../controllers/reset.controller.js";

const resetController = new ResetController();

export async function resetYesHandler(ctx: Context) {
  await ctx.answerCbQuery();

  if (!ctx.from) return;

  const response = await resetController.resetProfile(String(ctx.from.id));

  await ctx.editMessageText(response);
}

export async function resetNoHandler(ctx: Context) {
  await ctx.answerCbQuery();

  await ctx.editMessageText("❌ Profile reset cancelled.");
}
