import { Application } from 'express';

import { logging, methodDetermination } from '@cohbrgr/server';

const isProduction = process.env['NODE_ENV'] === 'production';

const middleware = (
    app: Application,
    done: () => void,
) => {
    app.use(logging(isProduction));
    app.use(methodDetermination);

    done();
};

export default middleware;
