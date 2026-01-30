import { resolve } from 'path';

import { createApp, staticFiles } from '@cohbrgr/server';
import { Config } from '@cohbrgr/content/env';
import { isProduction } from '@cohbrgr/utils';

const staticPath = resolve(process.cwd() + Config.staticPath);

const app = createApp({ isProduction });

app.use(staticFiles(staticPath));

export default app;
