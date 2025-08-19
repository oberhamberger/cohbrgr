import type { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';

import { Logger } from '@cohbrgr/utils';

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
