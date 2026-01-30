import type { Request, Response } from 'express';

/**
 * Health check endpoint handler that returns the server's operational status.
 */
export const getHealthStatus = (_req: Request, res: Response) => {
    res.send({
        status: 'OK',
    });
};
