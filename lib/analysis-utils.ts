import type { AnalysisResult } from '@/types/analysis';

/**
 * Pulls the first sentence from the roast string for use as a one-liner summary.
 */
export function extractOneLiner(roast: string): string {
  const firstPara = roast.split('\n\n')[0] ?? '';
  const match = firstPara.match(/^[^.!?]+[.!?]/);
  if (match) return match[0].trim();
  return firstPara.length > 100 ? firstPara.slice(0, 97) + '…' : firstPara;
}

/**
 * Returns a Tailwind text-color class based on the ATS score.
 */
export function scoreColorClass(score: number): string {
  if (score >= 75) return 'text-[#16A34A]';
  if (score >= 40) return 'text-[#D97706]';
  return 'text-[#DC2626]';
}

/**
 * Serialises an AnalysisResult into a plain-text string suitable for clipboard copy.
 */
export function formatResultAsText(result: AnalysisResult): string {
  let text = `Resume Roast\n\n${result.roast}\n\n`;
  text += `ATS Score: ${result.atsScore.score}/100 — ${result.atsScore.label}\n\n`;
  text += `Section Feedback:\n`;
  result.sectionFeedback.forEach((sec) => {
    text += `\n— ${sec.section} (${sec.rating}) —\n`;
    sec.issues.forEach((iss, i) => {
      text += `Issue: ${iss}\nFix: ${sec.fixes[i] ?? 'N/A'}\n\n`;
    });
  });
  text += `Rewrite Suggestions:\n`;
  result.rewriteSuggestions.forEach((sug) => {
    text += `\nOriginal: ${sug.original}\nRewritten: ${sug.rewritten}\nReason: ${sug.reason}\n`;
  });
  return text;
}
