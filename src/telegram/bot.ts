import { Telegraf } from "telegraf";
import { env } from "../config/env.js";

export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
