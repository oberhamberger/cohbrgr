import app from 'src/server/server';

import { Config } from '@cohbrgr/content/env';
import { gracefulStartAndClose } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const defaultPort = isProduction ? Config.port : Config.port + 30;
const port = process.env['PORT'] || defaultPort;

gracefulStartAndClose(app, Number(port));
