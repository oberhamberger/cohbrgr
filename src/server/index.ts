import express from 'express';
import helmet from 'helmet';

import Logger from 'src/server/utils/logger';

const app = express();
const staticPath = __dirname + '/../client';
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

// express server basic security
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'script-src': [
                    "'self'",
                    "'unsafe-inline'",
                    'cdn.ampproject.org',
                ],
            },
        },
    }),
);

// express server path configuration
app.use(express.static(staticPath));
app.use((req, res) => {
    // 404 handling
    Logger.log(
        'warn',
        `Returning 404 for Request: ${req.method} : ${req.path}`,
    );
    const temppath = staticPath + '/404.html';
    console.log(temppath);
    res.status(404).sendFile(staticPath + '/404.html');
});

// starting the server
const server = app.listen(port, () => {
    Logger.log('info', `Server started at http://localhost:${port}`);
});

// stopping the server correctly
const closeGracefully = async () => {
    await server.close();
    Logger.log('info', `Server closed.`);
    process.exit();
};
process.on('SIGINT', closeGracefully);
