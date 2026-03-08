import { Logger } from '@cohbrgr/utils';

import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware factory that creates a request logging handler with different verbosity for production vs development.
 * Includes the correlation ID when available.
 */
export const logging =
    (isProduction: boolean) =>
    (req: Request, res: Response, next: NextFunction) => {
        const correlationId = res.locals['correlationId'] as string | undefined;
        const meta = correlationId ? { correlationId } : {};

        if (!isProduction) {
            Logger.info(`Requesting: ${req.url}`, meta);
        } else {
            Logger.info(`${req.ip} requests: ${req.url}`, meta);
        }
        next();
    };
