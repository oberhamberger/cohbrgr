import { Request, Response } from 'express';
import React from 'react';
import { StaticContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import Index from 'src/server/template/index.html';

const doctype = '<!DOCTYPE html>';

const render =
    (useClientSideRendering: boolean) =>
    (req: Request, res: Response): Response => {
        const context: StaticContext = {};
        return res.send(
            doctype +
                renderToString(
                    <Index
                        location={req.url}
                        context={context}
                        useCSR={useClientSideRendering}
                    />,
                ),
        );
    };

export default render;
