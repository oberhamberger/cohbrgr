import type { Request, Response } from 'express';

declare global {
    type RenderThunk = () => (req: Request, res: Response) => Promise<void>;

    type RenderMiddlewareFactory = (
        isProduction: boolean,
        useClientSideRendering: boolean,
    ) => (req: Request, res: Response) => Promise<void>;
}



declare module 'src/server/server-entry' {
    const render: RenderThunk;
    export default render;
}

declare module 'src/server/middleware/render' {
    const renderMiddleware: RenderMiddlewareFactory;
    export default renderMiddleware;
}
