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

export const methodDetermination = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.method !== HttpMethod.GET && req.method !== HttpMethod.HEAD) {
        Logger.warn(
            `Unexpected Request with Method: ${req.method} on ${req.originalUrl}`,
        );
        res.statusCode = 405;
        return res.send('Method Not allowed');
    }
    next();
    return;
};
