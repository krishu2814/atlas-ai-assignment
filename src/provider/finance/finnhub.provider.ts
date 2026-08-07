import axios, { type AxiosInstance } from "axios";
import { env } from "../../config/env.js";

export class FinnhubProvider {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://finnhub.io/api/v1",
      timeout: 10_000,
      params: {
        token: env.FINNHUB_API_KEY,
      },
    });
  }

  async searchCompany(query: string) {
    const { data } = await this.client.get("/search", {
      params: {
        q: query,
      },
    });

    return data;
  }

  async getCompanyProfile(symbol: string) {
    const { data } = await this.client.get("/stock/profile2", {
      params: {
        symbol,
      },
    });

    return data;
  }

  async getQuote(symbol: string) {
    const { data } = await this.client.get("/quote", {
      params: {
        symbol,
      },
    });

    return data;
  }
}
