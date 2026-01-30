export const internalConfig = {
    local: {
        port: 3001,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: 'http://localhost:3002',
    },
    docker: {
        port: 3001,
        location: 'https://cohbrgr-content-o44imzpega-oa.a.run.app/',
        staticPath: '/dist',
        apiUrl: 'https://cohbrgr-api-944962437395.europe-west6.run.app',
    },
};

export const Config = process.env['DOCKER']
    ? internalConfig.docker
    : internalConfig.local;
