import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/lib/env';

/**
 * Returns a Gemini model instance using credentials from the environment.
 * Called at request time — a missing API key throws a clear error rather
 * than silently producing a broken client at module load.
 */
export function getGeminiModel() {
  return new GoogleGenerativeAI(env.geminiApiKey()).getGenerativeModel({
    model: env.geminiModel(),
  });
}
