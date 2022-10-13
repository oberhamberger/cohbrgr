import { NextFunction, Request, Response } from 'express';
import Logger from 'src/server/utils/logger';

const logging =
    (isProduction: boolean) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!isProduction) {
            Logger.info(`Requesting: ${req.url}`);
        } else {
            Logger.info(`${req.ip} - ${req.headers['user-agent']} requests: ${req.url}`);
        }
        next();
    };

export default logging;
