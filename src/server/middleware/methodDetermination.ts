import { NextFunction, Request, Response } from 'express';
import Logger from 'src/server/utils/logger';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

const methodDetermination = (
    req: Request,
    res: Response,
    next: NextFunction,
): Response => {
    if (req.method !== HttpMethod.GET) {
        Logger.warn(
            `Unexpected Request with Method: ${req.method} on ${req.originalUrl}`,
        );
        return res.status(405).send('Nothing here.');
    }
    next();
};

export default methodDetermination;
