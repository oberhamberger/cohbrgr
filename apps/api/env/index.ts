// Note: process.env values are inlined by DefinePlugin at build time
import { cloudRunOrigins, ports } from '@cohbrgr/env';

const isProduction = process.env.NODE_ENV === 'production';
const isCloudRun = process.env.CLOUD_RUN === 'true';

export const internalConfig = {
    local: {
        port: isProduction ? ports.api.prod : ports.api.dev,
        location: 'http://localhost',
        staticPath: '/dist',
    },
    cloudRun: {
        port: ports.api.prod,
        location: cloudRunOrigins.api,
        staticPath: '/dist',
    },
};

export const Config = isCloudRun
    ? internalConfig.cloudRun
    : internalConfig.local;
