import type { User } from "@prisma/client";
import { UserRepository } from "../../repositories/user.repository.js";
import { ONBOARDING_QUESTIONS } from "../../constants/onboarding.js";

export class OnboardingService {
  private readonly userRepository = new UserRepository();

  // helps to get the current question based on the user's onboarding step
  getCurrentQuestion(user: User) {
    if (user.onboardingCompleted) {
      return null;
    }
    // it trcaks current
    return ONBOARDING_QUESTIONS[user.onboardingStep];
  }

  // save the answer to the user's profile based on the current onboarding step
  async saveAnswer(user: User, answer: string) {
    const updates = [
      {
        profession: answer,
        onboardingStep: 1,
      },
      {
        interests: answer.split(",").map((item) => item.trim()),
        onboardingStep: 2,
      },
      {
        industries: answer.split(",").map((item) => item.trim()),
        onboardingStep: 3,
      },
      {
        companies: answer.split(",").map((item) => item.trim()),
        onboardingCompleted: true,
      },
    ];

    const update = updates[user.onboardingStep];
    if (!update) {
      return;
    }
    // update the user with the new data and increment the onboarding step
    await this.userRepository.update(user.id, update);
  }

  // Returns the next onboarding question after saving an answer
  async getNextQuestion(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || user.onboardingCompleted) {
      return null;
    }

    return ONBOARDING_QUESTIONS[user.onboardingStep];
  }
}
