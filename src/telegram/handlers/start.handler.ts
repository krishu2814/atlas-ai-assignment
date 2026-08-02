import { Context } from "telegraf";

export async function startHandler(ctx: Context) {
  await ctx.reply("👋 Welcome to Atlas AI!");
}
