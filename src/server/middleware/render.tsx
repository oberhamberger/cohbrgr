import { Request, Response } from 'express';
import React from 'react';
import { StaticContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import Index from 'src/server/template/index.html';
import Logger from 'src/server/utils/logger';

const doctype = '<!DOCTYPE html>';

const render =
    (useClientSideRendering: boolean, nonce: string) =>
    (req: Request, res: Response): Response => {
        Logger.info(`Rendering React Application with path: ${req.url}`);
        const context: StaticContext = {};
        return res.send(
            doctype +
                renderToString(
                    <Index
                        location={req.url}
                        context={context}
                        useCSR={useClientSideRendering}
                        nonce={nonce}
                    />,
                ),
        );
    };

export default render;
