import { resolve } from 'path';

import type { Application } from 'express';
import Express from 'express';

import { Config } from '@cohbrgr/content/env';
import { healthRoutes, logging, methodDetermination } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const staticPath = resolve(process.cwd() + Config.staticPath);

const app: Application = Express();

app.use(logging(isProduction));
app.use(methodDetermination);
app.use(Express.static(staticPath, { dotfiles: 'ignore' }));
app.use('/health', healthRoutes);

export default app;
