import { resolve } from 'path';

import { createApp, cspNonce, staticFiles } from '@cohbrgr/server';
import { cloudRunOrigins, ports } from '@cohbrgr/env';
import { Config } from '@cohbrgr/shell/env';
import { findProcessArgs, isProduction } from '@cohbrgr/utils';

import type { NextFunction, Request, Response } from 'express';

const staticPath = resolve(process.cwd() + Config.staticPath + '/client');
const isGenerator = findProcessArgs(['--generator']);

const contentOrigin =
    process.env['DOCKER'] === 'true'
        ? cloudRunOrigins.content
        : isProduction
          ? `http://localhost:${ports.content.prod}`
          : `http://localhost:${ports.content.dev}`;

const app = createApp({
    isProduction,
    rateLimit: true,
    compression: true,
    nocache: true,
    helmet: {
        contentSecurityPolicy: false,
    },
});

app.use(cspNonce(isGenerator));

app.use((_req: Request, res: Response, next: NextFunction) => {
    const nonce = res.locals['cspNonce'];
    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' ${contentOrigin} 'nonce-${nonce}'; connect-src 'self' ${contentOrigin}; style-src 'self' 'unsafe-inline' ${contentOrigin}`,
    );
    next();
});

app.use(staticFiles(staticPath, { maxAge: 3600 }));

export default app;
