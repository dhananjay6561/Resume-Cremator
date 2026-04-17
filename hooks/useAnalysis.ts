'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalysisResult } from '@/types/analysis';
import { API_ROUTES } from '@/lib/api-routes';
import { clientEnv } from '@/lib/client-env';

const ANALYZE_RETRY_DELAY_MS = 900;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAnalysis() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const analyzeText = useCallback(async (text: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setIsAnalyzing(true);
    setError(null);

    try {
      if (text.length < clientEnv.minResumeChars) {
        throw new Error(`Resume text must be at least ${clientEnv.minResumeChars} characters.`);
      }
      if (text.length > clientEnv.maxResumeChars) {
        throw new Error(`Resume text must not exceed ${clientEnv.maxResumeChars} characters.`);
      }

      let res = await fetch(API_ROUTES.ANALYZE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
        signal,
      });

      let data: { error?: string } & Partial<AnalysisResult> = await res.json();

      if (res.status === 503) {
        await sleep(ANALYZE_RETRY_DELAY_MS);
        res = await fetch(API_ROUTES.ANALYZE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: text }),
          signal,
        });
        data = await res.json();
      }

      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to analyze resume.');

      // Cache hit — navigate immediately, no artificial delay
      const cacheHit = res.headers.get('X-Cache') === 'HIT';
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
      sessionStorage.setItem('analysisCacheHit', String(cacheHit));
      router.push('/result');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsAnalyzing(false);
    }
  }, [router]);

  const analyzePdf = useCallback(async (file: File) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setIsAnalyzing(true);
    setError(null);

    try {
      if (file.size > clientEnv.maxPdfMb * 1024 * 1024) {
        throw new Error(`PDF file size must be less than ${clientEnv.maxPdfMb} MB.`);
      }

      const formData = new FormData();
      formData.append('file', file);

      const parseRes = await fetch(API_ROUTES.PARSE_PDF, {
        method: 'POST',
        body: formData,
        signal,
      });

      const parseData: { error?: string; text?: string } = await parseRes.json();
      if (!parseRes.ok || parseData.error) throw new Error(parseData.error ?? 'Failed to parse PDF.');
      if (!parseData.text) throw new Error('PDF returned no text content.');

      await analyzeText(parseData.text);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsAnalyzing(false);
    }
  }, [analyzeText]);

  return { analyzeText, analyzePdf, isAnalyzing, error, setError };
}
