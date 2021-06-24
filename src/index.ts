import express from 'express';
import helmet from 'helmet';
import path from 'path';

import Logger from './utils/logger';

const app = express();
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

// define a route handler for the default home page
app.get(
    '/',
    (req, res) => {
        Logger.log('info', `request to homepage - responding with index.html` );
        res.sendFile(path.join(__dirname+'/index.html'));
    }
);

// define a route handler for the default favicons
app.get(
    `${faviconsPath}:icon`,
    (req, res) => {
        Logger.log('info', `request to favicon - responding with ${req.params.icon}` );
        res.sendFile(path.join(__dirname+'/favicons/'+req.params.icon));
    }
);

// start the Express server
app.listen( port, () => {
    Logger.log('info', `server started at http://localhost:${ port }` );
} );
