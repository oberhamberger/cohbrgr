import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';
import nocache from 'nocache';
import { resolve } from 'path';

import { logging, methodDetermination } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { Logger, findProcessArgs } from '@cohbrgr/utils';
import { randomBytes } from 'crypto';

const isProduction = process.env['NODE_ENV'] === 'production';
const defaultPort = isProduction ? Config.port : Config.port + 30;
const port = process.env['PORT'] || defaultPort;
const staticPath = resolve(process.cwd() + Config.staticPath + '/client');
// const useClientSideRendering = true;
const isGenerator = findProcessArgs(['--generator']);

const app = express();

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
app.use(express.static(staticPath, { dotfiles: 'ignore' }));
app.use((_req, res, next) => {
    res.locals['cspNonce'] = isGenerator
        ? '!CSPNONCE_PLACEHOLDER!'
        : randomBytes(16).toString('hex');
    next();
});
// app.use(
//     helmet({
//         contentSecurityPolicy: {
//             useDefaults: true,
//             directives: {
//                 // 'script-src': [
//                 //     (req, res) =>
//                 //         `'nonce-${(res as unknown as Response).locals.cspNonce}'`,
//                 // ],
//                 'script-src': [
//                     "'self'",
//                     "'unsafe-inline'",
//                     'http://localhost:3031',
//                     'cohbrgr-content-o44imzpega-oa.a.run.app',
//                 ],
//                 'manifest-src': ["'self'"],
//                 'connect-src': ["'self'"],
//                 'worker-src': ["'self'"],
//                 'form-action': ["'none'"],
//                 'default-src': ["'none'"],
//             },
//         },
//     }),
// );

// app.use(jam(isProduction));

await (async () => {
    // @ts-expect-error
    const renderThunk = (await import('./server-entry'))
        .default as unknown as RenderThunk;

    const serverRender = renderThunk();

    app.use(serverRender);

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
})();
