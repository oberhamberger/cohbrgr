import type { RequestHandler, Response } from 'express';
import Express from 'express';

export interface StaticFilesOptions {
    /**
     * How to handle dotfiles. Defaults to 'ignore'.
     */
    dotfiles?: 'allow' | 'deny' | 'ignore';
    /**
     * Cache-Control max-age in seconds. If provided, sets Cache-Control header.
     */
    maxAge?: number;
}

/**
 * Creates a static file serving middleware with common options.
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
        staticOptions.setHeaders = (res: Response) => {
            res.set('Cache-Control', `public, max-age=${maxAge}`);
        };
    }

    return Express.static(path, staticOptions);
}
