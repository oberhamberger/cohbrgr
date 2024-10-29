import { NextFunction, Request, Response } from 'express';

export const logging =
    (isProduction: boolean) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!isProduction) {
            console.info(`Requesting: ${req.url}`);
        } else {
            console.info(`${req.ip} requests: ${req.url}`);
        }
        next();
    };
