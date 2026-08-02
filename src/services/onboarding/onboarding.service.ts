import type { User } from "@prisma/client";
import { UserRepository } from "../../repositories/user.repository.js";
import { ONBOARDING_QUESTIONS } from "../../constants/onboarding.js";
import type { OnboardingResult } from "../../types/onboarding.js";

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
  async saveAnswer(user: User, answer: string): Promise<OnboardingResult> {
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
      return { completed: true };
    }
    // update the user with the new data and increment the onboarding step
    await this.userRepository.update(user.id, update);
    // Fetch updated user
    const updatedUser = await this.userRepository.findById(user.id);
    if (!updatedUser) {
      throw new Error("User not found after onboarding update.");
    }
    // Onboarding finished
    if (updatedUser.onboardingCompleted) {
      return { completed: true };
    }
    // Return next question
    const nextQuestion = ONBOARDING_QUESTIONS[updatedUser.onboardingStep];
    if (!nextQuestion) {
      return {
        completed: true,
      };
    }
    return {
      completed: false,
      nextQuestion: nextQuestion.question,
    };
  }
}
