import { resolve } from 'path';
import express from 'express';
import cors from 'cors';
import { logging, methodDetermination } from '@cohbrgr/server';
import EnvironmentConfig from '@cohbrgr/environments';

const isProduction = process.env['NODE_ENV'] === 'production';
const defaultPort = EnvironmentConfig.content.port;
const port = process.env['PORT'] || defaultPort;
const staticPath = resolve(
    process.cwd() + EnvironmentConfig.content.staticPath,
);

const app = express();

app.use(logging(isProduction));
app.use(methodDetermination);
app.use(cors());
app.use(express.static(staticPath, { dotfiles: 'ignore' }));

console.log('staticPath: ', staticPath)

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
