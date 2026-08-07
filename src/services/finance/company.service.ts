import { FinnhubProvider } from "../../provider/finance/finnhub.provider.js";
import { AIService } from "../ai/ai.service.js";

export class CompanyService {
  private readonly finnhubProvider: FinnhubProvider;
  private readonly aiService: AIService;

  constructor() {
    this.finnhubProvider = new FinnhubProvider();
    this.aiService = new AIService();
  }

  async getCompanyIntelligence(company: string) {
    const searchResult = await this.finnhubProvider.searchCompany(company);
    if (!searchResult.result?.length) {
      throw new Error(`Company "${company}" not found.`);
    }

    const bestMatch = searchResult.result[0];
    const symbol = bestMatch.symbol;

    // Fetch company profile and quote in parallel
    const [profile, quote] = await Promise.all([
      this.finnhubProvider.getCompanyProfile(symbol),
      this.finnhubProvider.getQuote(symbol),
    ]);

    const explanation = await this.aiService.explainCompany({
      company: bestMatch.description,
      symbol,
      profile,
      quote,
    });

    return {
      company: bestMatch.description,
      symbol,
      profile,
      quote,
      explanation,
    };
  }
}
