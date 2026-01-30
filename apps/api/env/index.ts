const isProduction = process.env['NODE_ENV'] === 'production';

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

export const Config = process.env['DOCKER']
    ? internalConfig.docker
    : internalConfig.local;
