import { Context } from "telegraf";
import { ConversationController } from "../../controllers/conversation.controller.js";

const conversationController = new ConversationController();

export async function messageHandler(c: Context) {
  try {
    if (!c.from) return;
    if (!c.message || !("text" in c.message)) {
      return;
    }

    await c.sendChatAction("typing");

    const userMessage = c.message.text;

    const response = await conversationController.handleMessage({
      telegramId: String(c.from.id),
      username: c.from.username,
      firstName: c.from.first_name,
      lastName: c.from.last_name,
      message: userMessage,
    });

    await c.reply(response);
  } catch (error) {
    console.error("Message handler error:", error);
    await c.reply(
      "I encountered an error processing your message. Please try again in a moment.",
    );
  }
}
