import { PassThrough, Stream } from 'stream';

import { Request, Response } from 'express';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { HttpContextData } from 'src/client/contexts/http';
import Index from 'src/server/template/Index.html';

import { Logger } from '@cohbrgr/utils';
import { HttpMethod } from '@cohbrgr/server';
import { createSSRDataRegistry, SSRDataRegistry } from '@cohbrgr/localization';

/**
 * Converts a readable stream to a complete string by accumulating all chunks.
 */
const streamToString = (stream: Stream): Promise<string> => {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
};

/**
 * Renders the Index component with the given SSR data registry.
 */
const renderIndex = (
    isProduction: boolean,
    location: string,
    useCSR: boolean,
    nonce: string,
    httpContextData: HttpContextData,
    ssrRegistry: SSRDataRegistry,
) => (
    <Index
        isProduction={isProduction}
        location={location}
        useCSR={useCSR}
        nonce={nonce}
        httpContextData={httpContextData}
        ssrRegistry={ssrRegistry}
    />
);

/**
 * Middleware factory that creates a server-side rendering handler for React applications.
 * Implements two-pass SSR:
 * 1. First pass: Render to collect data requirements (e.g., translation fetch)
 * 2. Await all registered promises
 * 3. Second pass: Render with resolved data
 */
const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const ssrDataRegistry = createSSRDataRegistry();

        // First pass: render to collect data requirements
        const httpContextFirstPass: HttpContextData = {};
        Logger.info('SSR: Starting first pass to collect data requirements');
        renderToString(
            renderIndex(
                isProduction,
                req.url,
                useClientSideRendering,
                res.locals['cspNonce'],
                httpContextFirstPass,
                ssrDataRegistry.collectingRegistry,
            ),
        );

        // Await all registered promises (e.g., translation fetch)
        if (ssrDataRegistry.hasPromises()) {
            Logger.info('SSR: Awaiting registered promises');
            await ssrDataRegistry.awaitPromises();
            Logger.info('SSR: Promises resolved');
        } else {
            Logger.warn('SSR: No promises were registered during first pass');
        }

        // Second pass: render with resolved data
        const stream = new Promise<Stream>((resolve, reject) => {
            const httpContext: HttpContextData = {};
            try {
                const { pipe, abort } = renderToPipeableStream(
                    renderIndex(
                        isProduction,
                        req.url,
                        useClientSideRendering,
                        res.locals['cspNonce'],
                        httpContext,
                        ssrDataRegistry.resolvedRegistry,
                    ),
                    {
                        onAllReady() {
                            const renderStatusCode =
                                httpContext.statusCode || 200;
                            if (renderStatusCode < 300) {
                                Logger.info(
                                    `Rendered App with path: ${req.url}`,
                                );
                                res.setHeader(
                                    'Cache-Control',
                                    'public, max-age=3600',
                                );
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
            } catch (error) {
                Logger.error(error);
            }
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
