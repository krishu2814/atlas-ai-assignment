import { Context } from "telegraf";
import { BriefController } from "../../controllers/brief.controller.js";

const briefController = new BriefController();

export async function briefHandler(c: Context) {
  if (!c.from) {
    return;
  }

  // Optional: Show typing indicator while generating the briefing
  await c.sendChatAction("typing");

  const response = await briefController.generateBrief(String(c.from.id));

  await c.reply(response);
}
