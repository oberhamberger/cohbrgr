import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from 'express';

import { Logger } from '@cohbrgr/utils';

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
