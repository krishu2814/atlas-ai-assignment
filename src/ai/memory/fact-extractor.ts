export function buildFactExtractionPrompt(message: string): string {
  return `
You are an AI memory extractor.

Extract ONLY long-term facts worth remembering.

Remember:
- profession
- hobbies
- interests
- favorite technologies
- preferences
- skills
- goals
- education
- companies

Ignore:
- greetings
- questions
- temporary requests
- jokes
- small talk
- today's plans

Return ONLY a JSON array.

Examples:

Input:
I am a backend engineer.

Output:
["User is a backend engineer"]

Input:
I love football and AI.

Output:
["User loves football","User likes AI"]

Input:
Hello

Output:
[]

Input:
What's the weather?

Output:
[]

User message:
${message}
`;
}
