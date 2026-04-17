import { NextResponse } from 'next/server';

export const ErrorCode = {
  TooManyRequests: 'TOO_MANY_REQUESTS',
  UnsupportedMediaType: 'UNSUPPORTED_MEDIA_TYPE',
  InvalidJson: 'INVALID_JSON',
  InvalidRequest: 'INVALID_REQUEST',
  RequestTooLarge: 'REQUEST_TOO_LARGE',
  InvalidPdf: 'INVALID_PDF',
  PdfTooLarge: 'PDF_TOO_LARGE',
  PdfExtractionFailed: 'PDF_EXTRACTION_FAILED',
  ResumeTooShort: 'RESUME_TOO_SHORT',
  NotAResume: 'NOT_A_RESUME',
  InvalidAiResponse: 'INVALID_AI_RESPONSE',
  AiTemporarilyUnavailable: 'AI_TEMPORARILY_UNAVAILABLE',
  InternalError: 'INTERNAL_ERROR',
} as const;

type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

interface JsonErrorOptions {
  status: number;
  message: string;
  code: ErrorCodeValue;
  headers?: HeadersInit;
}

export function jsonError({ status, message, code, headers }: JsonErrorOptions) {
  return NextResponse.json({ error: message, code }, { status, headers });
}
