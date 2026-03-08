import rateLimit, { type Options } from 'express-rate-limit';

import { Logger } from '@cohbrgr/utils';

import type { Application, NextFunction, Request, Response } from 'express';

export interface RateLimitOptions {
    /**
     * Time window in milliseconds. Defaults to 10 minutes.
     */
    windowMs?: number;
    /**
     * Maximum requests per window. Defaults to 500.
     */
    max?: number;
}

/**
 * Applies rate limiting middleware to an Express app.
 * Only applies in production when isProduction is true.
 */
export function applyRateLimit(
    app: Application,
    isProduction: boolean,
    options: RateLimitOptions = {},
): void {
    if (!isProduction) {
        return;
    }

    const { windowMs = 10 * 60 * 1000, max = 500 } = options;

    app.set('trust proxy', 1);
    app.use(
        rateLimit({
            windowMs,
            max,
            handler: (
                request: Request,
                response: Response,
                _next: NextFunction,
                opts: Options,
            ) => {
                Logger.warn(
                    `Restricted request from ${request.ip} for ${request.path}`,
                );
                return response.status(opts.statusCode).send(opts.message);
            },
        }),
    );
}
