import app from 'src/server';

import { gracefulStartAndClose } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const defaultPort = isProduction ? 3002 : 3002 + 30;
const port = process.env['PORT'] || defaultPort;

gracefulStartAndClose(app, Number(port));
