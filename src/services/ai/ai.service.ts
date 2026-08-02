import { GroqProvider } from "../../provider/llm/groq.provider.js";
import { buildAtlasPrompt } from "../../ai/prompts/prompt.builder.js";
// this class generates a response from the LLM provider based on the input message
export class AIService {
  private readonly llmProvider: GroqProvider;

  constructor() {
    this.llmProvider = new GroqProvider();
  }

  async generateResponse(context: string, message: string): Promise<string> {
    const prompt = buildAtlasPrompt(context, message);
    const response = await this.llmProvider.generate(prompt);
    return response;
  }
}
