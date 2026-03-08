import { resolve } from 'path';

import { Config } from '@cohbrgr/content/env';
import { createApp, staticFiles } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

import type { NextFunction, Request, Response } from 'express';

const staticPath = resolve(process.cwd() + Config.staticPath);

const app = createApp({ isProduction, rateLimit: true });

app.use('/client', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use(staticFiles(staticPath));

export default app;
