import Express from 'express';

import type { RequestHandler, Response } from 'express';

export interface StaticFilesOptions {
    /**
     * How to handle dotfiles. Defaults to 'ignore'.
     */
    dotfiles?: 'allow' | 'deny' | 'ignore';
    /**
     * Cache-Control max-age in seconds. If provided, sets Cache-Control header.
     * Files with content hashes in their names automatically get immutable + 1 year cache.
     */
    maxAge?: number;
}

const CONTENT_HASH_PATTERN = /\.[a-f0-9]{16,}\.\w+$/;
const ONE_YEAR = 31536000;

/**
 * Creates a static file serving middleware with common options.
 * Files with content hashes (e.g. bundle.abc123.js) get long-lived immutable caching.
 */
export function staticFiles(
    path: string,
    options: StaticFilesOptions = {},
): RequestHandler {
    const { dotfiles = 'ignore', maxAge } = options;

    const staticOptions: Parameters<typeof Express.static>[1] = {
        dotfiles,
    };

    if (maxAge !== undefined) {
        staticOptions.setHeaders = (res: Response, filePath: string) => {
            if (CONTENT_HASH_PATTERN.test(filePath)) {
                res.set(
                    'Cache-Control',
                    `public, max-age=${ONE_YEAR}, immutable`,
                );
            } else {
                res.set('Cache-Control', `public, max-age=${maxAge}`);
            }
        };
    }

    return Express.static(path, staticOptions);
}
