import { Request, Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';

import Index from 'src/server/template/index.html';
import Logger from 'src/server/utils/logger';
import { HttpContextData } from 'src/client/contexts/http';
import { HttpMethod } from './methodDetermination';

const doctype = '<!DOCTYPE html>';

const render =
    (isProduction: boolean, useClientSideRendering: boolean) =>
    async (req: Request, res: Response) => {
        const httpContext: HttpContextData = {};

        const markup = await renderToString(
            <Index
                isProduction={isProduction}
                location={req.url}
                useCSR={useClientSideRendering}
                nonce={res.locals.nonce}
                httpContextData={httpContext}
            />,
        );

        const renderStatusCode = httpContext.statusCode || 200;

        if (renderStatusCode < 300) {
            Logger.info(`Rendered App with path: ${req.url}`);
        } else if (renderStatusCode < 400) {
            Logger.warn(`Redirected: ${req.url}`);
        } else if (renderStatusCode < 500) {
            Logger.warn(`Not found: ${req.url}`);
        } else {
            Logger.error(`Major Server Error while rendering: ${req.url}`);
        }

        res.status(renderStatusCode);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        if (req.method === HttpMethod.GET) {
            res.send(doctype + markup);
        } else if (req.method === HttpMethod.HEAD) {
            res.send();
        }
        res.end();
    };

export default render;
