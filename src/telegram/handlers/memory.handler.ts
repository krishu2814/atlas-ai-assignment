import { Context } from "telegraf";
import { MemoryController } from "../../controllers/memory.controller.js";

export class MemoryHandler {
  private readonly memoryController: MemoryController;

  constructor() {
    this.memoryController = new MemoryController();
  }

  async handle(c: Context) {
    try {
      if (!c.from) {
        return;
      }

      await c.sendChatAction("typing");

      const response = await this.memoryController.getMemory(String(c.from.id));

      await c.reply(response);
    } catch (error) {
      console.error("Memory handler error:", error);
      await c.reply("Unable to retrieve memory right now. Please try again later.");
    }
  }
}
