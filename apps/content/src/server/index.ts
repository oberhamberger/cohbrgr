import app from 'src/server/server';

import { Config } from '@cohbrgr/content/env';
import { gracefulStartAndClose } from '@cohbrgr/server';

const port = process.env['PORT'] || Config.port;

gracefulStartAndClose(app, Number(port));
