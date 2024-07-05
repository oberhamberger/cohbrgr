const isDocker = process.env['DOCKER'] === 'true';

const Config = {
    shell: {
        port: isProduction ? 3000 : 3030,
        location: {
            local: 'http://localhost',
            production: 'https://cohbrgr-shell-o44imzpega-oa.a.run.app/',
        },
        staticPath: {
            local: '/dist',
            production: '/apps/shell/dist',
        },
    },
    content: {
        port: isProduction ? 3001 : 3031,
        location: {
            local: 'http://localhost',
            production: 'https://cohbrgr-content-o44imzpega-oa.a.run.app/',
        },
        staticPath: {
            local: '/dist',
            production: '/apps/content/dist',
        },
    },
};

export const EnvironmentConfig = {
    shell: {
        port: Config.shell.port,
        location: isDocker
            ? Config.shell.location.production
            : Config.shell.location.local,
        staticPath: isDocker
            ? Config.shell.staticPath.production
            : Config.shell.staticPath.local,
    },
    content: {
        port: Config.content.port,
        location: isDocker
            ? Config.content.location.production
            : Config.content.location.local,
        staticPath: isDocker
            ? Config.content.staticPath.production
            : Config.content.staticPath.local,
    },
};

export default EnvironmentConfig;
