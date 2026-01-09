export const internalConfig = {
    local: {
        port: 3001,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    docker: {
        port: 3001,
        location: 'https://cohbrgr-content-o44imzpega-oa.a.run.app/',
        staticPath: '/dist',
    },
};

export const Config = process.env['DOCKER']
    ? internalConfig.docker
    : internalConfig.local;
