import { bot } from "./bot.js";

export async function startTelegramBot() {
  console.log("🤖 Starting Telegram bot...");
  await bot.launch();

  console.log("🤖 Telegram bot started");
}

export default bot;
