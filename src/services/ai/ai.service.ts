import { GroqProvider } from "../../provider/llm/groq.provider.js";

// this class generates a response from the LLM provider based on the input message
export class AIService {
  private readonly llmProvider: GroqProvider;

  constructor() {
    this.llmProvider = new GroqProvider();
  }

  async generateResponse(message: string): Promise<string> {
    return this.llmProvider.generate(message);
  }
}
