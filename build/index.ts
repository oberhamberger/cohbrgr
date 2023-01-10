import { Configuration } from 'webpack';
import getWebpackClientConfig from './configs/webpack.client.config';
import getWebpackServerConfig from './configs/webpack.server.config';

const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];

export default config;
