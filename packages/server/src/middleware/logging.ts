import { NextFunction, Request, Response } from 'express';
import { Logger } from '@cohbrgr/utils';

export const logging =
    (isProduction: boolean) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!isProduction) {
            Logger.info(`Requesting: ${req.url}`);
        } else {
            Logger.info(`${req.ip} requests: ${req.url}`);
        }
        next();
    };
