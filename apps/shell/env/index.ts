// Note: process.env values are inlined by DefinePlugin at build time
import { cloudRunOrigins, ports } from '@cohbrgr/env';

const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

const internalConfig = {
    local: {
        port: isProduction ? ports.shell.prod : ports.shell.dev,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: isProduction
            ? `http://localhost:${ports.api.prod}`
            : `http://localhost:${ports.api.dev}`,
    },
    docker: {
        port: ports.shell.prod,
        location: `${cloudRunOrigins.shell}/`,
        staticPath: '/dist',
        apiUrl: cloudRunOrigins.api,
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
