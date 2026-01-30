import { Logger } from '@cohbrgr/utils';

import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from 'express';

/**
 * Express error handler middleware that logs errors and returns a 500 status with a generic error message.
 */
export const errorHandler: ErrorRequestHandler = (
    err,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) => {
    Logger.error(`error: ${req.method} ${req.url} ${err}`);

    res.status(500).json({ error: 'Internal Server Error' });
};
