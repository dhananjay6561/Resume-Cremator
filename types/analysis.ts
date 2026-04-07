export interface AtsBreakdown {
  formatting: number;
  keywords: number;
  quantification: number;
  clarity: number;
}

export interface AtsScore {
  score: number;
  label: string;
  breakdown: AtsBreakdown;
}

export interface SectionFeedback {
  section: string;
  rating: 'poor' | 'average' | 'good';
  issues: string[];
  fixes: string[];
}

export interface RewriteSuggestion {
  original: string;
  rewritten: string;
  reason: string;
}

export interface AnalysisResult {
  roast: string;
  atsScore: AtsScore;
  sectionFeedback: SectionFeedback[];
  rewriteSuggestions: RewriteSuggestion[];
}
