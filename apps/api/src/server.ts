import Express from 'express';
import navigationRoutes from 'src/modules/navigation/navigation.routes';
import translationRoutes from 'src/modules/translation/translation.routes';

import { createApp, errorHandler } from '@cohbrgr/server';
import { ports, productionDomain } from '@cohbrgr/env';
import { isProduction } from '@cohbrgr/utils';

// Shell app origins that need to access the API
const shellOrigins = isProduction
    ? [`http://localhost:${ports.shell.prod}`, productionDomain]
    : [`http://localhost:${ports.shell.dev}`];

const app = createApp({
    isProduction,
    cors: { origins: shellOrigins },
});

app.use(Express.json());
app.use('/translation', translationRoutes);
app.use('/navigation', navigationRoutes);
app.use(errorHandler);

export default app;
