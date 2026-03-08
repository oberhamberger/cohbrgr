import { PassThrough, Stream } from 'stream';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { HttpContextData } from 'src/client/contexts/http';
import Index from 'src/server/template/Index.html';
import { DEHYDRATED_STATE_PLACEHOLDER } from 'src/server/template/components/Javascript.html';

import { HttpMethod } from '@cohbrgr/server';
import { Logger } from '@cohbrgr/utils';

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
 * Renders the Index component with the given QueryClient.
 */
const renderIndex = (
    isProduction: boolean,
    location: string,
    useCSR: boolean,
    nonce: string,
    httpContextData: HttpContextData,
    queryClient: QueryClient,
) => (
    <Index
        isProduction={isProduction}
        location={location}
        useCSR={useCSR}
        nonce={nonce}
        httpContextData={httpContextData}
        queryClient={queryClient}
    />
);

/**
 * Middleware factory that creates a server-side rendering handler for React applications.
 * Creates a QueryClient for SSR, allowing federated components to use TanStack Query.
 */
const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        // Create QueryClient for SSR - federated components will use this
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 5, // 5 minutes
                },
            },
        });

        const stream = new Promise<Stream>((resolve, reject) => {
            const httpContext: HttpContextData = {};
            let timeout: ReturnType<typeof setTimeout>;
            try {
                const { pipe, abort } = renderToPipeableStream(
                    renderIndex(
                        isProduction,
                        req.url,
                        useClientSideRendering,
                        res.locals['cspNonce'],
                        httpContext,
                        queryClient,
                    ),
                    {
                        onAllReady() {
                            clearTimeout(timeout);
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
                            clearTimeout(timeout);
                            Logger.error(error);
                            res.statusCode = 500;
                            res.setHeader('content-type', 'text/html');
                            reject(new Error('Something went wrong'));
                        },
                        onError(error) {
                            clearTimeout(timeout);
                            Logger.error(error);
                            res.statusCode = 500;
                            res.setHeader('content-type', 'text/html');
                            reject(new Error('Something went wrong'));
                        },
                    },
                );
                timeout = setTimeout(() => {
                    abort();
                    reject(new Error(`SSR render timed out for: ${req.url}`));
                }, 5000);
            } catch (error) {
                Logger.error(error);
                reject(error);
            }
        });

        const awaitedStream = await stream;
        let markup = await streamToString(awaitedStream);

        // Dehydrate QueryClient AFTER render completes (Suspense boundaries resolved)
        // This ensures all queries from federated components are captured
        const dehydratedState = dehydrate(queryClient);
        const dehydratedStateJson = JSON.stringify(dehydratedState)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/<\/script>/gi, '<\\/script>');

        // Replace placeholder with actual dehydrated state
        markup = markup.replace(
            DEHYDRATED_STATE_PLACEHOLDER,
            dehydratedStateJson,
        );

        if (req.method === HttpMethod.GET) {
            res.send(markup);
        } else if (req.method === HttpMethod.HEAD) {
            res.send();
        }
        res.end();
    };

export default render;
export type RenderMiddleware = typeof render;
