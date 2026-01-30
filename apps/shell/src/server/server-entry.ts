import type { Request, Response } from 'express';

/**
 * Factory function that creates a middleware handler which dynamically imports and executes the render middleware for SSR.
 */
const createRenderThunk = () => async (req: Request, res: Response) => {
    // @ts-expect-error: dynamic import of middleware/render is required for SSR compatibility
    const renderer = (await import('./middleware/render'))
        .default as unknown as RenderMiddlewareFactory;
    return renderer(true, true)(req, res);
};

export default createRenderThunk;
