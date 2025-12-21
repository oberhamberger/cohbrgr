import type { Request, Response } from 'express';

export const getHealthStatus = (_req: Request, res: Response) => {
    res.send({
        status: 'OK',
    });
};
