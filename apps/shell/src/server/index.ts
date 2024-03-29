import { join } from 'path';
import express, { Response } from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { Logger } from '@cohbrgr/utils';
import logging from 'src/server/middleware/logging';
import methodDetermination from 'src/server/middleware/methodDetermination';
import jam from 'src/server/middleware/jam';
import render from 'src/server/middleware/render';
import { randomBytes } from 'crypto';
import { findProcessArgs } from 'src/server/utils/findProcessArgs';

const isProduction = process.env.NODE_ENV === 'production';
const defaultPort = isProduction ? 3000 : 3030;
const port = process.env.PORT || defaultPort;
const staticPath = join(__dirname, '../client');
const useClientSideRendering = true;
const isGenerator = findProcessArgs(['--generator']);

const app = express();

if (isProduction) {
    app.use(
        rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            max: 500, // limit each IP to 500 requests per window
            handler: (request, response, next, options) => {
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
app.use(express.static(staticPath, { dotfiles: 'ignore' }));
app.use((req, res, next) => {
    res.locals.cspNonce = isGenerator
        ? '!CSPNONCE_PLACEHOLDER!'
        : randomBytes(16).toString('hex');
    next();
});
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'script-src': [
                    (req, res) =>
                        `'nonce-${(res as Response).locals.cspNonce}'`,
                ],
                'manifest-src': ["'self'"],
                'connect-src': ["'self'"],
                'worker-src': ["'self'"],
                'form-action': ["'none'"],
                'default-src': ["'none'"],
            },
        },
    }),
);

app.use(jam(isProduction));
app.use(render(isProduction, useClientSideRendering));

// starting the server
const server = app.listen(port, () => {
    Logger.info(
        `Server started at http://localhost:${port} in ${
            isProduction ? 'production' : 'development'
        } mode`,
    );
    if (process.send) {
        process.send('server-ready');
    }
});

// stopping the server correctly
const closeGracefully = async () => {
    await server.close();
    Logger.log('info', `Server closed.`);
    process.exit();
};
process.on('SIGTERM', closeGracefully);
process.on('SIGINT', closeGracefully);
