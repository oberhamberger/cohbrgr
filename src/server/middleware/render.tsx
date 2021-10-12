import { Request, Response } from 'express';
import React from 'react';
import { StaticContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import Index from 'src/server/template/index.html';
import Logger from 'src/server/utils/logger';

const doctype = '<!DOCTYPE html>';

const render =
    (useClientSideRendering: boolean, nonce: string) =>
    async (req: Request, res: Response): Promise<Response> => {
        const context: StaticContext = {};
        const markup = await renderToString(
            <Index
                location={req.url}
                context={context}
                useCSR={useClientSideRendering}
                nonce={nonce}
            />,
        );

        const renderStatusCode = context.statusCode || 200;

        if (renderStatusCode < 300) {
            Logger.info(`Rendered App with path: ${req.url}`);
        } else if (renderStatusCode < 400) {
            Logger.warn(`Redirected: ${req.url}`);
        } else if (renderStatusCode < 500) {
            Logger.warn(`Not found: ${req.url}`);
        } else {
            Logger.error(`Major Server Error while rendering: ${req.url}`);
        }

        return res.status(renderStatusCode).send(doctype + markup);
    };

export default render;
