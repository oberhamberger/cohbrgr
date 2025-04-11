import type { Request, Response } from 'express';

declare global {
    type RenderThunk = () => (req: Request, res: Response) => Promise<void>;

    type RenderMiddlewareFactory = (
        isProduction: boolean,
        useClientSideRendering: boolean,
    ) => (req: Request, res: Response) => Promise<void>;
}
