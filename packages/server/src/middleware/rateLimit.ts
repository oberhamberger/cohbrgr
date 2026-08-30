import rateLimit, { type Options } from 'express-rate-limit';

import { Logger } from '@cohbrgr/utils/node';

import type { Application, NextFunction, Request, Response } from 'express';

// Requests the limiter ignores. One page view costs several of these, which
// turns a 500-request budget into roughly fifty page views per address — far
// too low behind a NAT or corporate proxy, where every visitor shares a bucket.
export const STATIC_ASSET =
    /\.(?:woff2?|ttf|otf|eot|css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|webmanifest|txt|json)$/i;

export const isStaticAsset = (path: string): boolean => STATIC_ASSET.test(path);

export interface RateLimitOptions {
    /** Time window in milliseconds. Defaults to 10 minutes. */
    windowMs?: number;
    /** Maximum requests per window. Defaults to 500. */
    max?: number;
}

/** Production only. */
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
