import { resolve } from 'path';

import { createApp, cspNonce, staticFiles } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { findProcessArgs, isProduction } from '@cohbrgr/utils';

const staticPath = resolve(process.cwd() + Config.staticPath + '/client');
const isGenerator = findProcessArgs(['--generator']);

const app = createApp({
    isProduction,
    rateLimit: true,
    compression: true,
    nocache: true,
});

app.use(staticFiles(staticPath, { maxAge: 3600 }));
app.use(cspNonce(isGenerator));

export default app;
