import { PassThrough, Stream } from 'stream';

import { defaultTranslations, TranslationKeys } from '@cohbrgr/localization';
import { HttpMethod } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { Logger } from '@cohbrgr/utils';
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { HttpContextData } from 'src/client/contexts/http';
import Index from 'src/server/template/Index.html';

type TranslationData = {
    lang: string;
    keys: TranslationKeys;
};

/**
 * Fetches translations from the API for the specified language.
 * Falls back to default translations if the fetch fails.
 */
const fetchTranslations = async (lang: string = 'en'): Promise<TranslationData> => {
    try {
        const response = await fetch(`${Config.apiUrl}/translation/${lang}`);
        if (!response.ok) {
            Logger.warn(`Failed to fetch translations: ${response.statusText}`);
            return { lang, keys: defaultTranslations };
        }
        const data = await response.json();
        return { lang: data.lang, keys: data.keys };
    } catch (error) {
        Logger.warn(`Error fetching translations: ${error}`);
        return { lang, keys: defaultTranslations };
    }
};

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
 * Middleware factory that creates a server-side rendering handler for React applications with streaming support.
 */
const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const translations = await fetchTranslations('en');

        const stream = new Promise<Stream>((resolve, reject) => {
            const httpContext: HttpContextData = {};
            try {
                const { pipe, abort } = renderToPipeableStream(
                    <Index
                        isProduction={isProduction}
                        location={req.url}
                        useCSR={useClientSideRendering}
                        nonce={res.locals['cspNonce']}
                        httpContextData={httpContext}
                        translations={translations}
                    />,
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
