import { resolve } from 'path';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import Logger from 'src/server/utils/logger';
import methodDetermination from 'src/server/middleware/methodDetermination';
import render from 'src/server/middleware/render';
import { randomBytes } from 'crypto';

const app = express();
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = resolve(__dirname + '/../client');
const useClientSideRendering = true;
const nonce = randomBytes(16).toString('base64');

const useLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
const useCompression = compression();
const useHelmet = helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'script-src': [`'nonce-${nonce}'`],
            'manifest-src': ["'self'"],
            'connect-src': ["'self'"],
            'worker-src': ["'self'"],
            'form-action': ["'none'"],
            'default-src': ["'none'"],
        },
    },
});

app.use(useLimiter);
app.use(useCompression);
app.use(useHelmet);
app.use(methodDetermination);
app.use(express.static(staticPath, { dotfiles: 'ignore' }));
app.use(render(isProduction, useClientSideRendering, nonce));

// starting the server
const server = app.listen(port, () => {
    Logger.log(
        'info',
        `Server started at http://localhost:${port} in ${
            isProduction ? 'production' : 'development'
        } mode`,
    );
});

// stopping the server correctly
const closeGracefully = async () => {
    await server.close();
    Logger.log('info', `Server closed.`);
    process.exit();
};
process.on('SIGINT', closeGracefully);
