import { Context } from "telegraf";
import { MemoryController } from "../../controllers/memory.controller.js";

export class MemoryHandler {
  private readonly memoryController: MemoryController;

  constructor() {
    this.memoryController = new MemoryController();
  }

  async handle(c: Context) {
    if (!c.from) {
      return;
    }

    const response = await this.memoryController.getMemory(String(c.from.id));

    await c.reply(response);
  }
}
