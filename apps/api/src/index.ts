import app from 'src/server';

import { Config } from '@cohbrgr/api/env';
import { gracefulStartAndClose } from '@cohbrgr/server';

const port = process.env['PORT'] || Config.port;

gracefulStartAndClose(app, Number(port));
