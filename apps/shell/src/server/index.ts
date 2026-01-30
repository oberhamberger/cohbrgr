import app from 'src/server/server';

import { gracefulStartAndClose } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';

const port = process.env['PORT'] || Config.port;

/**
 * Dynamically imports and initializes the render middleware for server-side rendering.
 */
const renderThunk =
    // @ts-expect-error: dynamic import of server-entry is required for SSR compatibility
    ((await import('./server-entry')).default as unknown as RenderThunk)();

app.use(renderThunk);

gracefulStartAndClose(app, Number(port));
