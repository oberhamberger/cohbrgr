import type { Application } from 'express';
import Express from 'express';
import navigationRoutes from 'src/modules/navigation/navigation.routes';
import translationRoutes from 'src/modules/translation/translation.routes';

import {
    errorHandler,
    healthRoutes,
    logging,
    methodDetermination,
} from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const app: Application = Express();

app.use(logging(isProduction));
app.use(methodDetermination);
app.use(Express.json());

app.use('/translation', translationRoutes);
app.use('/navigation', navigationRoutes);
app.use('/health', healthRoutes);
app.use(errorHandler);

export default app;
