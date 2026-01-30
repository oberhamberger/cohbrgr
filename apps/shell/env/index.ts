const internalConfig = {
    local: {
        port: 3000,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: 'http://localhost:3002',
    },
    docker: {
        port: 3000,
        location: 'https://cohbrgr-o44imzpega-oa.a.run.app/',
        staticPath: '/dist',
        apiUrl: 'https://cohbrgr-api-944962437395.europe-west6.run.app',
    },
};

export const Config = process.env['DOCKER']
    ? internalConfig.docker
    : internalConfig.local;
