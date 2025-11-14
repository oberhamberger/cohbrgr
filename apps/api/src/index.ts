import type { Application } from 'express';
import Express from 'express';
import initMiddleware from 'src/middleware';

const app: Application = Express();

initMiddleware(app);
