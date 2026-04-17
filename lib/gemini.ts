import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/lib/env';

export function getGeminiModel(modelName?: string) {
  return new GoogleGenerativeAI(env.geminiApiKey()).getGenerativeModel({
    model: modelName ?? env.geminiModel(),
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.85,
      maxOutputTokens: 8192,
    },
  });
}
