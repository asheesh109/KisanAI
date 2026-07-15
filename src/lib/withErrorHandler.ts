import { NextRequest, NextResponse } from 'next/server';
import { sanitizeError } from './errors';

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>;

// Wrap any route handler so thrown errors are always sanitized before reaching the client
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      const appError = sanitizeError(err);
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.statusCode }
      );
    }
  };
}