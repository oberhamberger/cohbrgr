import { PassThrough, Stream } from 'stream';

import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { HttpContextData } from 'src/client/contexts/http';
import { fetchTranslations } from 'src/client/queries/translation';
import Index from 'src/server/template/Index.html';

import { HttpMethod } from '@cohbrgr/server';
import { createTranslationCache, TranslationCache } from '@cohbrgr/localization';
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
 * Renders the Index component with the given translation cache.
 */
const renderIndex = (
    isProduction: boolean,
    location: string,
    useCSR: boolean,
    nonce: string,
    httpContextData: HttpContextData,
    translationCache: TranslationCache,
) => (
    <Index
        isProduction={isProduction}
        location={location}
        useCSR={useCSR}
        nonce={nonce}
        httpContextData={httpContextData}
        translationCache={translationCache}
    />
);

/**
 * Middleware factory that creates a server-side rendering handler for React applications.
 * Uses Suspense to handle async data loading - components suspend until data is ready,
 * then the stream flushes the complete HTML.
 */
const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        // Create a Suspense-compatible translation cache
        const translationCache = createTranslationCache(() =>
            fetchTranslations('en'),
        );

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
                        translationCache,
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
