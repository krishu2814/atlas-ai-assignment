import { Context } from "telegraf";
import { ConversationController } from "../../controllers/conversation.controller.js";

const conversationController = new ConversationController();

export async function messageHandler(c: Context) {
  if (!c.message || !("text" in c.message)) {
    return;
  }

  const userMessage = c.message.text;
  const response = await conversationController.handleMessage(userMessage);
  // wait for the response from the conversation controller and send it back to the user
  await c.reply(response);
}
