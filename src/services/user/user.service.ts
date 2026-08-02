import { UserRepository } from "../../repositories/user.repository.js";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getOrCreateUser(data: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }) {
    const existingUser = await this.userRepository.findByTelegramId(
      data.telegramId,
    );

    if (existingUser) {
      return existingUser;
    }

    // if not -> create a new user
    return this.userRepository.create(data);
  }

  async getById(userId: string) {
    return this.userRepository.findById(userId);
  }
  async findByTelegramId(telegramId: string) {
    return this.userRepository.findByTelegramId(telegramId);
  }
  // to reset the onboarding process for a user -> update
  async resetOnboarding(userId: string) {
    return this.userRepository.update(userId, {
      onboardingCompleted: false,
      onboardingStep: 0,
    });
  }
}
