import { randomBytes } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const NONCE_PLACEHOLDER = '!CSPNONCE_PLACEHOLDER!';

/**
 * Middleware that generates a CSP nonce for each request.
 * The nonce is stored in res.locals['cspNonce'].
 *
 * @param usePlaceholder - If true, uses a placeholder string instead of random bytes.
 *                         Useful for static site generation where nonces are replaced at runtime.
 */
export function cspNonce(usePlaceholder: boolean) {
    return (_req: Request, res: Response, next: NextFunction): void => {
        res.locals['cspNonce'] = usePlaceholder
            ? NONCE_PLACEHOLDER
            : randomBytes(16).toString('hex');
        next();
    };
}
