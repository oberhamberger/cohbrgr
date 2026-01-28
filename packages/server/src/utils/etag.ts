import { createHash } from 'crypto';

import type { Response } from 'express';

/**
 * Generate an ETag hash from a payload
 */
export const etagOf = (payload: unknown): string => {
    const jsonString = JSON.stringify(payload);
    return createHash('sha1').update(jsonString).digest('hex');
};

/**
 * Send JSON response with ETag header.
 * Returns 304 Not Modified if client's If-None-Match matches.
 */
export const sendJsonWithEtag = (response: Response, payload: unknown) => {
    const tag = etagOf(payload);
    response.set('ETag', tag);
    if (response.req.headers['if-none-match'] === tag) {
        return response.status(304).end();
    }
    return response.json(payload);
};
