/**
 * Centralised API route paths.
 * Import this on the CLIENT side (hooks, components) to avoid hardcoding strings.
 * Never import server-only modules here — this file is safe for client bundles.
 */
export const API_ROUTES = {
  ANALYZE:   '/api/analyze',
  PARSE_PDF: '/api/parse-pdf',
} as const;
