// Note: process.env values are inlined by DefinePlugin at build time
import { cloudRunOrigins, ports } from '@cohbrgr/env';

const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

export const internalConfig = {
    local: {
        port: isProduction ? ports.content.prod : ports.content.dev,
        location: 'http://localhost',
        staticPath: '/dist',
        apiUrl: isProduction
            ? `http://localhost:${ports.api.prod}`
            : `http://localhost:${ports.api.dev}`,
    },
    docker: {
        port: ports.content.prod,
        location: `${cloudRunOrigins.content}/`,
        staticPath: '/dist',
        apiUrl: cloudRunOrigins.api,
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
