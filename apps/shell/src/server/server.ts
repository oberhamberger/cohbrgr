import { resolve } from 'path';

import { createApp, cspNonce, staticFiles } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { findProcessArgs, isProduction } from '@cohbrgr/utils';

import type { Response } from 'express';

const staticPath = resolve(process.cwd() + Config.staticPath + '/client');
const isGenerator = findProcessArgs(['--generator']);

const contentOrigin =
    process.env['DOCKER'] === 'true'
        ? 'https://cohbrgr-content-o44imzpega-oa.a.run.app'
        : isProduction
          ? 'http://localhost:3001'
          : 'http://localhost:3031';

const app = createApp({
    isProduction,
    rateLimit: true,
    compression: true,
    nocache: true,
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    contentOrigin,
                    (_req: unknown, res: unknown) =>
                        `'nonce-${(res as Response).locals['cspNonce']}'`,
                ],
                connectSrc: ["'self'", contentOrigin],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    },
});

app.use(cspNonce(isGenerator));
app.use(staticFiles(staticPath, { maxAge: 3600 }));

export default app;
