import { resolve } from 'path';
import express from 'express';
import { Logger } from '@cohbrgr/utils';
import logging from 'src/server/middleware/logging';
import methodDetermination from 'src/server/middleware/methodDetermination';

const isProduction = process.env.NODE_ENV === 'production';
const defaultPort = isProduction ? 3001 : 3031;
const port = process.env.PORT || defaultPort;
const staticPath = resolve(process.cwd(), 'dist');

const app = express();

app.use(logging(isProduction));
app.use(methodDetermination);
app.use(express.static(staticPath, { dotfiles: 'ignore' }));

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
