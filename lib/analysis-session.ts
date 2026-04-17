import type { AnalysisResult } from '@/types/analysis';

let currentAnalysisResult: AnalysisResult | null = null;

export function setAnalysisResult(result: AnalysisResult): void {
  currentAnalysisResult = result;
}

export function getAnalysisResult(): AnalysisResult | null {
  return currentAnalysisResult;
}

export function clearAnalysisResult(): void {
  currentAnalysisResult = null;
}
