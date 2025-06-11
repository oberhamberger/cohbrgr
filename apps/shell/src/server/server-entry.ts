import type { Request, Response } from 'express';

const createRenderThunk = () => async (req: Request, res: Response) => {
    // @ts-expect-error: dynamic import of middleware/render is required for SSR compatibility
    const renderer = (await import('./middleware/render'))
        .default as unknown as RenderMiddlewareFactory;
    return renderer(true, true)(req, res);
};

export default createRenderThunk;
