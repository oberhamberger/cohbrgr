import EnvironmentConfig from '@cohbrgr/environments';
import { Logger } from '@cohbrgr/utils';
import Express from 'express';
import initMiddleware from 'src/server/middleware';

const isProduction = process.env['NODE_ENV'] === 'production';
const defaultPort = isProduction
    ? EnvironmentConfig.content.port
    : EnvironmentConfig.content.port + 30;
const port = process.env['PORT'] || defaultPort;

const app = Express();

const done = () => {
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
}

initMiddleware(Express, app, done);
