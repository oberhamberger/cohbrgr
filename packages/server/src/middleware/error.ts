import type { ErrorRequestHandler, Request, Response } from 'express';

import { Logger } from '@cohbrgr/utils';

export const errorHandler: ErrorRequestHandler = (
    err,
    req: Request,
    res: Response,
) => {
    Logger.error(`error: ${req.method} ${req.url} ${err}`);

    res.status(500).json({ error: 'Internal Server Error' });
};
