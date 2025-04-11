export const Config = {
    local: {
        port: 3001,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    docker: {
        port: 3001,
        location: 'https://cohbrgr-content-o44imzpega-oa.a.run.app/',
        staticPath: '/apps/content/dist',
    },
};
