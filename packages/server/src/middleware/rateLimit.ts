import rateLimit, { type Options } from 'express-rate-limit';

import { Logger } from '@cohbrgr/utils/node';

import type { Application, NextFunction, Request, Response } from 'express';

/**
 * Requests the limiter ignores. A single page view already costs several of
 * these — stylesheet, scripts, icons, and now two font files — so counting them
 * turns a 500-request budget into roughly fifty page views per address. That is
 * low for anyone behind a corporate proxy or a NAT, where every visitor shares
 * one bucket, and it is what the limiter exists to protect least.
 */
export const STATIC_ASSET =
    /\.(?:woff2?|ttf|otf|eot|css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|webmanifest|txt|json)$/i;

/** True when the path is an asset the limiter should not count. */
export const isStaticAsset = (path: string): boolean => STATIC_ASSET.test(path);

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
            // Only dynamic routes are counted.
            skip: (request: Request) => isStaticAsset(request.path),
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
