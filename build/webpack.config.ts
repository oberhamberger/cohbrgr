import webpackClientConfig from './webpack.client.config';
import webpackServerConfig from './webpack.server.config';

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production'
}

export const isProduction = process.env.NODE_ENV === Mode.PRODUCTION;

export default [webpackClientConfig(), webpackServerConfig()];
