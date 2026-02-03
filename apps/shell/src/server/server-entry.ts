import type { Request, Response } from 'express';

import type { RenderMiddleware } from './middleware/render';

/**
 * Factory function that creates a middleware handler which dynamically imports and executes the render middleware for SSR.
 */
const createRenderThunk = () => async (req: Request, res: Response) => {
    const mod = await import('./middleware/render.tsx');
    const renderer = mod.default as unknown as RenderMiddleware;
    return renderer(true, true)(req, res);
};

export default createRenderThunk;
export type RenderThunk = typeof createRenderThunk;
