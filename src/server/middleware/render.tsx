import React from 'react';
import { renderToString } from 'react-dom/server';
import { Request, Response } from 'express';
import Index from 'src/server/template/index.html';
import App from 'src/client/components/App';

const render =
    () =>
    (req: Request, res: Response): Response => {
        return res.send(
            '<!Doctype html>' +
                renderToString(
                    <Index>
                        <App />
                    </Index>,
                ),
        );
    };

export default render;
