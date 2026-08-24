import type { StockQuote } from "../../types/finance.js";

export function buildCompanyExplanationPrompt(companyData: unknown): string {
  return `
You are Atlas AI, an intelligent finance assistant.

You are given structured financial data from Finnhub.

Rules:

- Use ONLY the provided data.
- Never invent information.
- Keep the response under 120 words.
- Explain in simple language.

Mention:

• What the company does
• Industry
• Today's stock movement
• One possible interpretation of today's movement

Financial Data:

${JSON.stringify(companyData, null, 2)}
`;
}

export function buildStockAnalysisPrompt(quote: StockQuote): string {
  const sign = quote.change >= 0 ? "+" : "";

  return `
You are Atlas AI, a financial intelligence assistant.

You are given real-time verified stock market quote data.

Rules:
- Ground your analysis strictly in the provided data.
- NEVER fabricate prices, volume, or company news not present in the data.
- Keep the explanation concise (under 100 words).
- Provide a neutral, objective observation of today's price action and intraday range.
- Conclude with: "⚠️ Informational only — not financial advice."

Market Data:
• Symbol: ${quote.symbol}
• Current Price: $${quote.price}
• Today's Change: ${sign}${quote.change} (${sign}${quote.changePercent}%)
• Day Range: High $${quote.high} / Low $${quote.low}
• Open: $${quote.open}
• Previous Close: $${quote.previousClose}
`;
}

