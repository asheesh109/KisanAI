// Central place to convert raw DB/driver errors into safe, user-facing errors.
// Prevents leaking connection strings, credentials, stack traces, etc.

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

// Known MongoDB/Mongoose error patterns we want to catch and rewrite
const DB_ERROR_MAP: { match: (err: any) => boolean; toAppError: (err: any) => AppError }[] = [
  {
    // Auth failures (bad user/pass, IP not whitelisted, etc.)
    match: (err) =>
      err?.name === 'MongoServerError' &&
      (err.codeName === 'AuthenticationFailed' || err.code === 18),
    toAppError: () =>
      new AppError('Unable to connect to the database right now. Please try again later.', 503, 'DB_AUTH_ERROR'),
  },
  {
    // Connection/timeout errors
    match: (err) => err?.name === 'MongoNetworkError' || err?.name === 'MongooseServerSelectionError',
    toAppError: () =>
      new AppError('Service temporarily unavailable. Please try again shortly.', 503, 'DB_CONNECTION_ERROR'),
  },
  {
    // Mongoose validation errors — safe-ish, but strip internal field paths/messages
    match: (err) => err?.name === 'ValidationError',
    toAppError: (err) =>
      new AppError('The data submitted is invalid. Please check your input.', 400, 'VALIDATION_ERROR'),
  },
  {
    // Duplicate key errors
    match: (err) => err?.code === 11000,
    toAppError: () => new AppError('A record with this value already exists.', 409, 'DUPLICATE_KEY'),
  },
];

/**
 * Converts any thrown error into a safe AppError.
 * Logs the raw error server-side, but never forwards raw driver internals to the caller.
 */
export function sanitizeError(err: unknown): AppError {
  // Already a safe, intentional error
  if (err instanceof AppError) return err;

  // Log full raw error server-side only (never sent to client)
  console.error('[DB/Server Error]', err);

  for (const rule of DB_ERROR_MAP) {
    if (rule.match(err)) return rule.toAppError(err);
  }

  // Fallback: never leak the original message/stack
  return new AppError('Something went wrong. Please try again later.', 500, 'INTERNAL_ERROR');
}