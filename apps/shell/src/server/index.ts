import { resolve } from 'path';
import express from 'express';
import nocache from 'nocache';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { EnvironmentConfig } from '@cohbrgr/environments';
import { logging, methodDetermination } from '@cohbrgr/server';
// import jam from 'src/server/middleware/jam';
import render from 'src/server/middleware/render';
import { randomBytes } from 'crypto';

const isProduction = process.env['NODE_ENV'] === 'production';
const defaultPort = EnvironmentConfig.shell.port;
const port = process.env['PORT'] || defaultPort;
const staticPath = resolve(
    process.cwd() + EnvironmentConfig.shell.staticPath + '/client/static',
);
const useClientSideRendering = true;

const app = express();

if (isProduction) {
    app.set('trust proxy', 1);
    app.use(
        rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            max: 500, // limit each IP to 500 requests per window
            handler: (request, response, _next, options) => {
                console.log(
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
app.use((_req, res, next) => {
    // isGenerator =>     res.locals['cspNonce'] = '!CSPNONCE_PLACEHOLDER!'
    res.locals['cspNonce'] = randomBytes(16).toString('hex');
    next();
});
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                // 'script-src': [
                //     (req, res) =>
                //         `'nonce-${(res as unknown as Response).locals.cspNonce}'`,
                // ],
                'script-src': [
                    "'self'",
                    "'unsafe-inline'",
                    'http://localhost:3001',
                    'cohbrgr-content-o44imzpega-oa.a.run.app',
                ],
                'manifest-src': ["'self'"],
                'connect-src':  [
                    "'self'",
                    "'unsafe-inline'",
                    'http://localhost:3001',
                    'cohbrgr-content-o44imzpega-oa.a.run.app',
                ],
                'worker-src': ["'self'"],
                'form-action': ["'none'"],
                'default-src': ["'none'"],
            },
        },
    }),
);

// app.use(jam(isProduction));
app.use(render(isProduction, useClientSideRendering));

// starting the server
const server = app.listen(port, () => {
    console.info(
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
    console.log('info', `Server closed.`);
    process.exit();
};
process.on('SIGTERM', closeGracefully);
process.on('SIGINT', closeGracefully);
