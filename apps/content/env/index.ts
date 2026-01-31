// Note: Using dot notation (process.env.X) allows Rspack to inline values at build time
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

export const internalConfig = {
    local: {
        port: isProduction ? 3001 : 3031,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: isProduction
            ? 'http://localhost:3002'
            : 'http://localhost:3032',
    },
    docker: {
        port: 3001,
        location: 'https://cohbrgr-content-o44imzpega-oa.a.run.app/',
        staticPath: '/dist',
        apiUrl: 'https://cohbrgr-api-944962437395.europe-west6.run.app',
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
