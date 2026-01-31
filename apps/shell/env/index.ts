// Note: Using dot notation (process.env.X) allows Rspack to inline values at build time
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

const internalConfig = {
    local: {
        port: isProduction ? 3000 : 3030,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: isProduction
            ? 'http://localhost:3002'
            : 'http://localhost:3032',
    },
    docker: {
        port: 3000,
        location: 'https://cohbrgr-o44imzpega-oa.a.run.app/',
        staticPath: '/dist',
        apiUrl: 'https://cohbrgr-api-944962437395.europe-west6.run.app',
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
