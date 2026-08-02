import { Context } from "telegraf";
import { UserController } from "../../controllers/user.controller.js";

export class ProfileHandler {
  private readonly userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  async handle(ctx: Context): Promise<void> {
    try {
      const telegramId = String(ctx.from?.id);

      const profile = await this.userController.getProfile(telegramId);

      await ctx.reply(profile);
    } catch (error) {
      console.error(error);

      await ctx.reply(
        "⚠️ Unable to fetch your profile. Please try again later.",
      );
    }
  }
}
