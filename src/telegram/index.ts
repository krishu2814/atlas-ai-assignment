import { bot } from "./bot.js";
import { startHandler } from "./handlers/start.handler.js";
import { messageHandler } from "./handlers/message.handler.js";

bot.start(startHandler);

// deprecated, but still works
bot.on("text", messageHandler);
export async function startTelegramBot() {
  console.log("🤖 Starting Telegram bot...");
  await bot.launch();

  console.log("🤖 Telegram bot started");
}

export default bot;
