import { GroqProvider } from "../../provider/llm/groq.provider.js";
import { buildUserPrompt } from "../../ai/prompts/prompt.builder.js";
import { buildFactExtractionPrompt } from "../../ai/memory/fact-extractor.js";
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

  async extractFacts(message: string): Promise<string[]> {
    const prompt = buildFactExtractionPrompt(message);
    const response = await this.llmProvider.generate(prompt);
    // console.log("========== FACT EXTRACTION ==========");
    // console.log("MESSAGE:", message);
    // console.log("LLM RESPONSE:", response);
    // console.log("====================================");
    try {
      const facts = JSON.parse(response);
      if (!Array.isArray(facts)) {
        return [];
      }
      return facts.filter(
        (fact): fact is string =>
          typeof fact === "string" && fact.trim().length > 0,
      );
    } catch {
      return [];
    }
  }
}
