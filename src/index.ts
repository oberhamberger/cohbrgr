import express from 'express';
import helmet from 'helmet';
import path from 'path';

import Logger from './utils/logger';

const app = express();
const router = express.Router();
const staticPath = __dirname + '/public';
const port = process.env.port || 3000; // default port to listen
const faviconsPath = '/favicons/';

// security
app.use(helmet(
    {
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'", "cdn.ampproject.org"],
            },
        }
    }
));

router.use((req,res,next) => {
    Logger.log('info', `${req.method} : ${req.path}`);
    next();
});
app.use('/', router);
app.use(express.static(staticPath));
app.use((req, res, next) => {
    Logger.log('warn', `Returning 404 for Request: ${req.method} : ${req.path}`);
    res.status(404).sendFile(staticPath + '/404.html');
});

// start the Express server
app.listen(port, () => {
    Logger.log('info', `server started at http://localhost:${ port }` );
} );
