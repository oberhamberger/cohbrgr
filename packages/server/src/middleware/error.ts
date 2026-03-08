import { Logger } from '@cohbrgr/utils';

import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from 'express';

/**
 * Express error handler middleware that logs errors and returns a 500 status with a generic error message.
 * Includes the correlation ID in the response for production debugging.
 */
export const errorHandler: ErrorRequestHandler = (
    err,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const correlationId = res.locals['correlationId'] as string | undefined;
    const meta = correlationId ? { correlationId } : {};

    Logger.error(`error: ${req.method} ${req.url} ${err}`, meta);

    res.status(500).json({
        error: 'Internal Server Error',
        ...(correlationId && { correlationId }),
    });
};
