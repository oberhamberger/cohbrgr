import { resolve } from 'path';

import compression from 'compression';
import { randomBytes } from 'crypto';
import type { Application } from 'express';
import Express from 'express';
import rateLimit from 'express-rate-limit';
import nocache from 'nocache';

import { healthRoutes, logging, methodDetermination } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { Logger, findProcessArgs, isProduction } from '@cohbrgr/utils';

const staticPath = resolve(process.cwd() + Config.staticPath + '/client');
const isGenerator = findProcessArgs(['--generator']);

const app: Application = Express();

if (isProduction) {
    app.set('trust proxy', 1);
    app.use(
        rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            max: 500, // limit each IP to 500 requests per window
            handler: (request, response, _next, options) => {
                Logger.log(
                    'warn',
                    `Restricted request from ${request.ip} for ${request.path}`,
                );
                return response
                    .status(options.statusCode)
                    .send(options.message);
            },
        }),
    );
}

app.use(nocache());
app.use(logging(isProduction));
app.use(methodDetermination);
app.use(compression());
app.use(
    Express.static(staticPath, {
        dotfiles: 'ignore',
        setHeaders: (res) => {
            res.set('Cache-Control', 'public, max-age=3600');
        },
    }),
);
app.use((_req, res, next) => {
    res.locals['cspNonce'] = isGenerator
        ? '!CSPNONCE_PLACEHOLDER!'
        : randomBytes(16).toString('hex');
    next();
});

app.use('/health', healthRoutes);

export default app;
