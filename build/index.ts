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

if (isWatch) {
    compiler.watch({}, (error) => {
        if (error) {
            Logger.error(error);
        }
    });
} else {
    compiler.run((error) => {
        if (error) {
            Logger.error(error);
        }
    });
}

export default config;
