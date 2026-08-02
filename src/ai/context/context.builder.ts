import type { User } from "@prisma/client";

export function buildUserContext(user: User) {
  return `
User Information:
Name: ${user.firstName ?? "Unknown"}
Username: ${user.username ?? "Unknown"}
Telegram ID: ${user.telegramId ?? "Unknown"}
Profession: ${user.profession ?? "Not provided"}
Interests: ${user.interests.length > 0 ? user.interests.join(", ") : "Not provided"}
Industries: ${user.industries.length > 0 ? user.industries.join(", ") : "Not provided"}
Companies followed: ${user.companies.length > 0 ? user.companies.join(", ") : "Not provided"}
`;
}
