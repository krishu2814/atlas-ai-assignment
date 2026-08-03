import { GroqProvider } from "../../provider/llm/groq.provider.js";
import { buildUserPrompt } from "../../ai/prompts/prompt.builder.js";
// this class generates a response from the LLM provider based on the input message
export class AIService {
  private readonly llmProvider: GroqProvider;

  constructor() {
    this.llmProvider = new GroqProvider();
  }

  async generateResponse(
    history: string,
    context: string,
    message: string,
  ): Promise<string> {
    const prompt = buildUserPrompt(context, history, message);
    const response = await this.llmProvider.generate(prompt);
    return response;
  }

  async summarizeDailyBrief(
    firstName: string,
    articles: string,
  ): Promise<string> {
    const prompt = `
        You are Atlas AI.

        Generate a personalized morning briefing.

        The response should follow this format:

        🌅 Good Morning ${firstName}!

        Here's your personalized briefing.

        Summarize the news into clear bullet points.

        Keep the response under 250 words.

        Only use the provided news.

        News:
        ${articles}
    
        `;

    return this.llmProvider.generate(prompt);
  }
}
