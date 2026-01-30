import type { Application } from 'express';

import { Logger, isProduction } from '@cohbrgr/utils';

/**
 * Starts the Express server on the specified port and sets up graceful shutdown handlers for SIGTERM and SIGINT.
 */
export const gracefulStartAndClose = (app: Application, port: number) => {
    // starting the server
    const server = app.listen(port, () => {
        Logger.info(
            `Server started at http://localhost:${port} in ${
                isProduction ? 'production' : 'development'
            } mode`,
        );
        if (process.send) {
            process.send('server-ready');
        }
    });

    /**
     * Closes the server gracefully and exits the process.
     */
    const closeGracefully = async () => {
        await server.close();
        Logger.log('info', `Server closed.`);
        process.exit();
    };
    process.on('SIGTERM', closeGracefully);
    process.on('SIGINT', closeGracefully);
};
