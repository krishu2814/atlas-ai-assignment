import axios from "axios";
import { env } from "../../config/env.js";
import type { NewsResponse } from "../../types/news.js";

export class GNewsProvider {
  private readonly baseUrl = "https://gnews.io/api/v4";

  async search(query: string): Promise<NewsResponse> {
    const { data } = await axios.get<NewsResponse>(`${this.baseUrl}/search`, {
      params: {
        q: query,
        lang: "en",
        max: 5,
        apikey: env.GNEWS_API_KEY,
      },
    });

    return data;
  }
}
