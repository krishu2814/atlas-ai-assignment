import { FinanceService } from "../services/finance/finance.service.js";

export class FinanceController {
  private readonly financeService: FinanceService;

  constructor() {
    this.financeService = new FinanceService();
  }

  async getStockQuote(symbol: string) {
    return this.financeService.getStockQuote(symbol);
  }

  async getStockIntelligence(symbol: string) {
    return this.financeService.getStockIntelligence(symbol);
  }
}
