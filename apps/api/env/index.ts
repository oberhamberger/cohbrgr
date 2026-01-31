// Note: Using dot notation (process.env.X) allows Rspack to inline values at build time
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

export const internalConfig = {
    local: {
        port: isProduction ? 3002 : 3032,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    docker: {
        port: 3002,
        location: 'https://cohbrgr-api-944962437395.europe-west6.run.app',
        staticPath: '/dist',
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
