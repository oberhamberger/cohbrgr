export const internalConfig = {
    local: {
        port: 3002,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    docker: {
        port: 3002,
        location: 'https://cohbrgr-api-o44imzpega-oa.a.run.app/',
        staticPath: '/apps/api/dist',
    },
};

export const Config = process.env['DOCKER']
    ? internalConfig.docker
    : internalConfig.local;
