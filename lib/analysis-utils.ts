import type { AnalysisResult } from '@/types/analysis';
import { scoreColor } from '@/lib/score-color';

export function extractOneLiner(roast: string): string {
  const firstPara = roast.split('\n\n')[0] ?? '';
  const match = firstPara.match(/^[^.!?]+[.!?]/);
  if (match) return match[0].trim();
  return firstPara.length > 100 ? firstPara.slice(0, 97) + '…' : firstPara;
}

export function scoreColorClass(score: number): string {
  return scoreColor(score).text;
}

export function formatResultAsText(result: AnalysisResult): string {
  let text = `Resume Analysis\n\n${result.roast}\n\n`;
  text += `ATS Score: ${result.ats_score.overall}/100\n`;
  text += `Verdict: ${result.ats_score.verdict}\n\n`;
  text += `Section Feedback:\n`;
  result.sections.forEach((sec) => {
    text += `\n— ${sec.name} (${sec.rating}) —\n`;
    text += `${sec.roast}\n`;
    sec.issues.forEach((iss, i) => {
      text += `Issue: ${iss}\nFix: ${sec.fixes[i] ?? 'N/A'}\n\n`;
    });
  });
  if (result.red_flags.length > 0) {
    text += `Red Flags:\n`;
    result.red_flags.forEach((flag) => { text += `• ${flag}\n`; });
    text += '\n';
  }
  text += `Fix This First:\n${result.one_thing}\n\n`;
  text += `Rewrite Suggestions:\n`;
  result.rewrites.forEach((sug) => {
    text += `\nOriginal: ${sug.original}\nRewritten: ${sug.rewritten}\nReason: ${sug.reason}\n`;
  });
  return text;
}
