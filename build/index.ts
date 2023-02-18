import webpack, { Configuration } from 'webpack';
import getWebpackClientConfig from 'build/configs/webpack.client.config';
import getWebpackServerConfig from 'build/configs/webpack.server.config';
import Logger from 'src/server/utils/logger';
import { isWatch } from 'build/utils/constants';

const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];
const compiler = webpack(config);
const errorFallback = (error: Error | null | undefined) => {
    if (error) {
        Logger.error(error);
    }
};

if (isWatch) {
    compiler.watch({}, errorFallback);
} else {
    compiler.run(errorFallback);
}

export default config;
