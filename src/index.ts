import express from 'express';
import helmet from 'helmet';

import Logger from './utils/logger';

const app = express();
const staticPath = __dirname + '/public';
const defaultPort = 3000;
const port = process.env.port || defaultPort;

// express server basic security
app.use(helmet(
    {
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'", "cdn.ampproject.org"],
            },
        }
    }
));

// express server path configuration
app.use(express.static(staticPath));
app.use((req, res) => {
    // 404 handling
    Logger.log('warn', `Returning 404 for Request: ${req.method} : ${req.path}`);
    res.status(404).sendFile(staticPath + '/404.html');
});

// starting the server
const server = app.listen(port, () => {
    Logger.log('info', `Server started at http://localhost:${ port }` );
} );

// stopping the server correctly
const closeGracefully = async () => {
    await server.close();
    Logger.log('info', `Server closed.`);
    process.exit()
}
process.on('SIGINT', closeGracefully)