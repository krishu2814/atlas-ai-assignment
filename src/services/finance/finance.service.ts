import { FinnhubProvider } from "../../provider/finance/finnhub.provider.js";
import { AIService } from "../ai/ai.service.js";
import type { StockQuote } from "../../types/finance.js";

export class FinanceService {
  private readonly finnhubProvider: FinnhubProvider;
  private readonly aiService: AIService;

  constructor() {
    this.finnhubProvider = new FinnhubProvider();
    this.aiService = new AIService();
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new Error("Stock symbol is required.");
    }

    const quote = await this.finnhubProvider.getQuote(normalizedSymbol);

    // Finnhub returns { c: 0, d: null, dp: null, ... t: 0 } for invalid/non-existent symbols
    if (!quote || (quote.c === 0 && quote.t === 0)) {
      throw new Error(`Stock symbol "${normalizedSymbol}" not found.`);
    }

    return {
      symbol: normalizedSymbol,
      price: quote.c ?? 0,
      change: quote.d ?? 0,
      changePercent: quote.dp ?? 0,
      high: quote.h ?? 0,
      low: quote.l ?? 0,
      open: quote.o ?? 0,
      previousClose: quote.pc ?? 0,
      timestamp: quote.t ?? Date.now(),
    };
  }

  async getStockIntelligence(symbol: string): Promise<{ quote: StockQuote; analysis: string }> {
    const quote = await this.getStockQuote(symbol);
    const analysis = await this.aiService.analyzeStock(quote);

    return {
      quote,
      analysis,
    };
  }
}
