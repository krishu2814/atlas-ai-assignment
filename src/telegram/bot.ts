import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
import { ProfileHandler } from "./handlers/profile.handler.js";
import { startHandler } from "./handlers/start.handler.js";
import { messageHandler } from "./handlers/message.handler.js";
import { updateHandler } from "./handlers/update.handler.js";
import { HelpHandler } from "./handlers/help.handler.js";
import { resetHandler } from "./handlers/reset.handler.js";
import {
  resetYesHandler,
  resetNoHandler,
} from "./handlers/reset-confirm.handler.js";
import { newsHandler } from "./handlers/news.handler.js";

// console.log("Telegram token:", env.TELEGRAM_BOT_TOKEN?.slice(0, 10));
export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

const profileHandler = new ProfileHandler();
const helpHandler = new HelpHandler();

bot.start((ctx) => startHandler(ctx));
bot.command("profile", (ctx) => profileHandler.handle(ctx));
bot.command("update", (ctx) => updateHandler(ctx));
bot.command("help", (c) => helpHandler.handle(c));
bot.command("reset", (c) => resetHandler(c));
bot.action("reset_yes", resetYesHandler);
bot.action("reset_no", resetNoHandler);
bot.command("news", (c) => newsHandler(c));
// catches all text messages including commands
bot.on("text", (ctx) => messageHandler(ctx));
