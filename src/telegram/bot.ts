import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
// console.log("Telegram token:", env.TELEGRAM_BOT_TOKEN?.slice(0, 10));
export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
