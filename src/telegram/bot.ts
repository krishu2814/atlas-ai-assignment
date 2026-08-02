import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
import { ProfileHandler } from "./handlers/profile.handler.js";
import { startHandler } from "./handlers/start.handler.js";
import { messageHandler } from "./handlers/message.handler.js";

// console.log("Telegram token:", env.TELEGRAM_BOT_TOKEN?.slice(0, 10));
export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

const profileHandler = new ProfileHandler();

bot.start((ctx) => startHandler(ctx));
bot.command("profile", (ctx) => profileHandler.handle(ctx));
bot.on("text", (ctx) => messageHandler(ctx));
