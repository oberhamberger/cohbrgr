import { Logger } from '@cohbrgr/utils';

import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware factory that creates a request logging handler with different verbosity for production vs development.
 */
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
