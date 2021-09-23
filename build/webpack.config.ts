import { Configuration } from 'webpack';
import getWebpackClientConfig from './webpack.client.config';
import getWebpackServerConfig from './webpack.server.config';

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production'
}

export const isProduction = process.env.NODE_ENV === Mode.PRODUCTION;

const config: Configuration[] = []
const clientConfig: Configuration = getWebpackClientConfig();
config.push(clientConfig);

if (isProduction) {
    config.push(getWebpackServerConfig());
}


export default config;
