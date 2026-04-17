export interface AtsBreakdown {
  formatting: number;
  keywords: number;
  quantification: number;
  clarity: number;
  impact: number;
}

export interface AtsScore {
  overall: number;
  breakdown: AtsBreakdown;
  verdict: string;
}

export interface Section {
  name: string;
  rating: 'poor' | 'average' | 'good';
  score: number;
  roast: string;
  issues: string[];
  fixes: string[];
}

export interface Rewrite {
  original: string;
  rewritten: string;
  reason: string;
}

export interface AnalysisResult {
  roast: string;
  ats_score: AtsScore;
  sections: Section[];
  rewrites: Rewrite[];
  red_flags: string[];
  one_thing: string;
}
