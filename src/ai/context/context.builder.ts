import type { User } from "@prisma/client";

export function buildUserContext(user: User, memories: string[]): string {
  const semanticContext =
    memories.length === 0
      ? ""
      : `

Long-term Memory:
${memories.map((memory) => `- ${memory}`).join("\n")}
`;

  return `
User Information:
Name: ${user.firstName ?? "Unknown"}
Username: ${user.username ?? "Unknown"}
Telegram ID: ${user.telegramId}
Profession: ${user.profession ?? "Not provided"}
Interests: ${user.interests.length ? user.interests.join(", ") : "Not provided"}
Industries: ${
    user.industries.length ? user.industries.join(", ") : "Not provided"
  }
Companies followed: ${
    user.companies.length ? user.companies.join(", ") : "Not provided"
  }
${semanticContext}
`;
}
