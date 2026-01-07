import { resolve } from 'path';

import Express, { Application } from 'express';

import { Config } from '@cohbrgr/content/env';
import { logging, methodDetermination } from '@cohbrgr/server';

const isProduction = process.env['NODE_ENV'] === 'production';
const staticPath = resolve(process.cwd() + Config.staticPath);

const middleware = (
    express: typeof Express,
    app: Application,
    done: () => void,
) => {
    app.use(logging(isProduction));
    app.use(methodDetermination);
    app.use(express.static(staticPath, { dotfiles: 'ignore' }));

    done();
};

export default middleware;
