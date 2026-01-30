import Express from 'express';
import navigationRoutes from 'src/modules/navigation/navigation.routes';
import translationRoutes from 'src/modules/translation/translation.routes';

import { createApp, errorHandler } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const app = createApp({ isProduction });

app.use(Express.json());
app.use('/translation', translationRoutes);
app.use('/navigation', navigationRoutes);
app.use(errorHandler);

export default app;
