import { UserService } from "../services/user/user.service.js";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // fetch user profile based on the telegramId and return a formatted string with the user's information
  async getProfile(telegramId: string): Promise<string> {
    const user = await this.userService.getById(telegramId);
    if (!user) {
      return "User profile not found.";
    }

    return `
👤 Your Profile

Profession:
${user.profession ?? "Not provided"}

Interests:
${user.interests.length ? user.interests.map((i) => `• ${i}`).join("\n") : "Not provided"}

Industries:
${user.industries.length ? user.industries.map((i) => `• ${i}`).join("\n") : "Not provided"}

Companies:
${user.companies.length ? user.companies.map((c) => `• ${c}`).join("\n") : "Not provided"}
`;
  }
}
