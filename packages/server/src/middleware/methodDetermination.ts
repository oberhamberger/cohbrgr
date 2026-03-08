import { NextFunction, Request, Response } from 'express';

import { Logger } from '@cohbrgr/utils';

import type { RequestHandler } from 'express';

export enum HttpMethod {
    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
    PATCH = 'PATCH',
}

/**
 * Middleware that restricts incoming requests to only GET and HEAD methods, returning 405 for others.
 */
export const methodDetermination: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.method !== HttpMethod.GET && req.method !== HttpMethod.HEAD) {
        Logger.warn(
            `Unexpected Request with Method: ${req.method} on ${req.originalUrl}`,
        );
        res.status(405).send('Method Not allowed');
        return;
    }
    next();
};
