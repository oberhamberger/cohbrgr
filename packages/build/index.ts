import webpack, { Configuration } from 'webpack';
import getWebpackClientConfig from './configs/webpack.client.config';
import getWebpackServerConfig from './configs/webpack.server.config';
import { isWatch } from './utils/constants';
const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];
const compiler = webpack(config);

if (isWatch) {
    compiler.watch({}, (error) => {
        if (error) {
            console.error(error);
        }
    });
} else {
    compiler.run((error) => {
        if (error) {
            console.error(error);
        }
    });
}

export default config;
