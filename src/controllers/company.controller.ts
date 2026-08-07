import { CompanyService } from "../services/finance/company.service.js";

export class CompanyController {
  private readonly companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  async getCompanyIntelligence(company: string) {
    console.log("[Controller] getCompanyIntelligence");
    return this.companyService.getCompanyIntelligence(company);
  }
}
