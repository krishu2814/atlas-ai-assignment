import axios from "axios";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export class HuggingFaceEmbeddingProvider {
  private readonly model = "sentence-transformers/all-MiniLM-L6-v2";
  private readonly apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.model}`;
  private readonly cache = new Map<string, number[]>();

  async getEmbedding(text: string): Promise<number[]> {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return [];
    }

    // 1. Check in-memory cache
    const cached = this.cache.get(normalizedText);
    if (cached) {
      return cached;
    }

    // 2. If API Key is present, call Hugging Face Inference API
    if (env.HUGGINGFACE_API_KEY) {
      try {
        const response = await axios.post<number[] | number[][]>(
          this.apiUrl,
          {
            inputs: normalizedText,
            options: {
              wait_for_model: true,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
            },
            timeout: 10_000,
          },
        );

        let vector: number[] = [];
        if (Array.isArray(response.data)) {
          if (Array.isArray(response.data[0])) {
            vector = response.data[0] as number[];
          } else {
            vector = response.data as number[];
          }
        }

        if (vector.length > 0) {
          this.cache.set(normalizedText, vector);
          return vector;
        }
      } catch (error: any) {
        logger.warn(
          { error: error?.message, model: this.model },
          "Hugging Face embedding API call failed. Falling back to local vector representation.",
        );
      }
    }

    // 3. Fallback deterministic vector generator (384 dimensions)
    const fallbackVector = this.generateDeterministicEmbedding(normalizedText);
    this.cache.set(normalizedText, fallbackVector);
    return fallbackVector;
  }

  private generateDeterministicEmbedding(text: string, dimensions = 384): number[] {
    const vector = new Array(dimensions).fill(0);
    const tokens = text.toLowerCase().split(/[\s,.-]+/).filter(Boolean);

    // 1. Hash word tokens
    for (const token of tokens) {
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dimensions;
      vector[idx] += 1.5;
    }

    // 2. Hash subword trigrams
    for (let i = 0; i < text.length - 2; i++) {
      const trigram = text.slice(i, i + 3).toLowerCase();
      let hash = 0;
      for (let j = 0; j < trigram.length; j++) {
        hash = (hash << 5) - hash + trigram.charCodeAt(j);
        hash |= 0;
      }
      const idx = Math.abs(hash) % dimensions;
      vector[idx] += 0.5;
    }

    // 3. L2 Unit Normalization
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map((val) => val / norm);
  }
}

