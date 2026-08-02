import Groq from "groq-sdk";
import { env } from "../../config/env.js";

// creates a connection object
const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export class GroqProvider {
  async generate(prompt: string): Promise<string> {
    // Creates a model response for the given chat conversation.
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // will fix it based on use case
    });

    return completion.choices[0]?.message?.content ?? "No response generated";
  }
}
