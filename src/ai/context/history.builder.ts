import type { Conversation } from "@prisma/client";

export function buildConversationHistory(messages: Conversation[]) {
  return messages.map((m) => `${m.role}: ${m.content}`).join("\n");
}
