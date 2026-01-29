import app from 'src/server/server';

import { gracefulStartAndClose } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';
import { isProduction } from '@cohbrgr/utils';

const defaultPort = isProduction ? Config.port : Config.port + 30;
const port = process.env['PORT'] || defaultPort;

// Dynamic import of render middleware for SSR compatibility
const renderThunk = (
    // @ts-expect-error: dynamic import of server-entry is required for SSR compatibility
    (await import('./server-entry')).default as unknown as RenderThunk
)();

app.use(renderThunk);

gracefulStartAndClose(app, Number(port));
