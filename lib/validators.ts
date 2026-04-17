import { z } from 'zod';
import { clientEnv } from '@/lib/client-env';

const MIN_CHARS = clientEnv.minResumeChars;
const MAX_CHARS = clientEnv.maxResumeChars;

export const analyzeRequestSchema = z.object({
  resumeText: z
    .string()
    .trim()
    .min(MIN_CHARS, `Resume text must be at least ${MIN_CHARS} characters.`)
    .max(MAX_CHARS, `Resume text must not exceed ${MAX_CHARS} characters.`),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const ATSResultSchema = z.object({
  roast: z.string(),
  ats_score: z.object({
    overall: z.number().min(0).max(100),
    breakdown: z.object({
      formatting: z.number(),
      keywords: z.number(),
      quantification: z.number(),
      clarity: z.number(),
      impact: z.number(),
    }),
    verdict: z.string(),
  }),
  sections: z.array(z.object({
    name: z.string(),
    rating: z.enum(['poor', 'average', 'good']),
    score: z.number(),
    roast: z.string(),
    issues: z.array(z.string()),
    fixes: z.array(z.string()),
  })),
  rewrites: z.array(z.object({
    original: z.string(),
    rewritten: z.string(),
    reason: z.string(),
  })),
  red_flags: z.array(z.string()),
  one_thing: z.string(),
});

export type ATSResult = z.infer<typeof ATSResultSchema>;
