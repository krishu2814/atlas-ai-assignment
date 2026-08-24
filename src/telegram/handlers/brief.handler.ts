import { Context } from "telegraf";
import { BriefController } from "../../controllers/brief.controller.js";

const briefController = new BriefController();

export async function briefHandler(c: Context) {
  try {
    if (!c.from) {
      return;
    }

    await c.sendChatAction("typing");

    const response = await briefController.generateBrief(String(c.from.id));

    await c.reply(response);
  } catch (error) {
    console.error("Brief command failed:", error);
    await c.reply(
      "Unable to generate your briefing right now. Please try again later.",
    );
  }
}
