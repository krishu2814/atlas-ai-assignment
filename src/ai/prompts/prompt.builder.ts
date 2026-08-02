import { ATLAS_SYSTEM_PROMPT } from "./atlas.prompt.js";

export function buildAtlasPrompt(context: string, message: string) {
  return `

${ATLAS_SYSTEM_PROMPT}
${context}
${message}
`;
}
