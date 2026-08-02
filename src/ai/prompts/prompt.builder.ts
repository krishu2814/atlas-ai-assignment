import { ATLAS_SYSTEM_PROMPT } from "./atlas.prompt.js";

export function buildAtlasPrompt(
  context: string,
  history: string,
  message: string,
) {
  return `
${ATLAS_SYSTEM_PROMPT}
USER PROFILE:
${context}
CONVERSATION HISTORY:
${history}
CURRENT MESSAGE:
${message}
`;
}
