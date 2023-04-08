import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';

import Index from 'src/server/template/Index.html';
import Logger from 'src/server/utils/logger';
import { HttpContextData } from 'src/client/contexts/http';

const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const httpContext: HttpContextData = {};

        const stream = renderToPipeableStream(
            <Index
                isProduction={isProduction}
                location={req.url}
                useCSR={useClientSideRendering}
                nonce={res.locals.nonce}
                httpContextData={httpContext}
            />,
            {
                onShellReady: () => {
                    const renderStatusCode = httpContext.statusCode || 200;
                    if (renderStatusCode < 300) {
                        Logger.info(`Rendered App with path: ${req.url}`);
                    } else if (renderStatusCode < 400) {
                        Logger.warn(`Redirected: ${req.url}`);
                    } else if (renderStatusCode < 500) {
                        Logger.warn(`Not found: ${req.url}`);
                    } else {
                        Logger.error(
                            `Major Server Error while rendering: ${req.url}`,
                        );
                    }

                    res.status(renderStatusCode);
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                },
            },
        );

        stream.pipe(res);
    };

export default render;
