export const internalConfig = {
    local: {
        port: 3002,
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
