import { Context } from "telegraf";
import { HelpController } from "../../controllers/help.controller.js";

export class HelpHandler {
  private readonly helpController: HelpController;

  constructor() {
    this.helpController = new HelpController();
  }
  async handle(c: Context) {
    const response = this.helpController.getHelp();

    await c.reply(response);
  }
}
