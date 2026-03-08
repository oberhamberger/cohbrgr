import { randomUUID } from 'crypto';

import type { NextFunction, Request, Response } from 'express';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Middleware that assigns a correlation ID to each request.
 * Uses the incoming `x-correlation-id` header if present, otherwise generates a new UUID.
 * The ID is stored in `res.locals['correlationId']` and set as a response header.
 */
export function correlationId(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const id =
        (req.headers[CORRELATION_ID_HEADER] as string | undefined) ||
        randomUUID();
    res.locals['correlationId'] = id;
    res.setHeader(CORRELATION_ID_HEADER, id);
    next();
}
