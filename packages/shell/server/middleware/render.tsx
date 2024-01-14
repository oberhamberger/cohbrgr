import { PassThrough, Stream } from 'stream';
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';

import Index from '@shell/server/template/Index.html';
import Logger from '@shell/server/utils/logger';
import { HttpMethod } from '@shell/server/middleware/methodDetermination';
import { HttpContextData } from '@shell/client/contexts/http';

const streamToString = (stream: Stream): Promise<string> => {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
};

const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const stream = new Promise<Stream>((resolve, reject) => {
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
                    onAllReady() {
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
                        res.setHeader(
                            'Content-Type',
                            'text/html; charset=utf-8',
                        );
                        const body = new PassThrough();
                        pipe(body);
                        resolve(body);
                    },
                    onShellError(error) {
                        Logger.error(error);
                        res.statusCode = 500;
                        res.setHeader('content-type', 'text/html');
                        reject(new Error('Something went wrong'));
                    },
                    onError(error) {
                        Logger.error(error);
                        res.statusCode = 500;
                        res.setHeader('content-type', 'text/html');
                        reject(new Error('Something went wrong'));
                    },
                },
            );
            setTimeout(abort, 5000);
        });

        const awaitedStream = await stream;
        const markup = await streamToString(awaitedStream);

        if (req.method === HttpMethod.GET) {
            res.send(markup);
        } else if (req.method === HttpMethod.HEAD) {
            res.send();
        }
        res.end();
    };

export default render;
