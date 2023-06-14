import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';

import Index from 'src/server/template/Index.html';
import Logger from 'src/server/utils/logger';
import { HttpContextData } from 'src/client/contexts/http';

const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const httpContext: HttpContextData = {};

        const { pipe, abort } = renderToPipeableStream(
            <Index
                isProduction={isProduction}
                location={req.url}
                useCSR={useClientSideRendering}
                nonce={res.locals.cspNonce}
                httpContextData={httpContext}
            />,
            {
                onShellReady() {
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

                    pipe(res);
                },
                onShellError(error) {
                    Logger.error(error);
                    res.statusCode = 500;
                    res.setHeader('content-type', 'text/html');
                    res.send('<h1>Something went wrong</h1>');
                },
                onError(error) {
                    Logger.error(error);
                },
            },
        );

        setTimeout(() => {
            Logger.error('Render timed out');
            abort();
            res.end();
        }, 10000);
    };

export default render;
