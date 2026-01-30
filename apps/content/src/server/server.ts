import { resolve } from 'path';

import { Config } from '@cohbrgr/content/env';
import { createApp, staticFiles } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const staticPath = resolve(process.cwd() + Config.staticPath);

const app = createApp({ isProduction });

app.use(staticFiles(staticPath));

export default app;
