const internalConfig = {
    local: {
        port: 3000,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    docker: {
        port: 3000,
        location: 'https://cohbrgr-o44imzpega-oa.a.run.app/',
        staticPath: '/apps/shell/dist',
    },
};

export const Config = process.env['DOCKER'] ? internalConfig.docker : internalConfig.local;