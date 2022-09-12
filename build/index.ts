import { Configuration } from 'webpack';
import getWebpackClientConfig from './configs/webpack.client.config';
import getWebpackServerConfig from './configs/webpack.server.config';
import getWebpackServiceWorkerConfig from './configs/webpack.service-worker.config';
import { isProduction } from './utils/constants';

const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];
isProduction && config.push(getWebpackServiceWorkerConfig());

export default config;
