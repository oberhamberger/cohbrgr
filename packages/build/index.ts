import webpack, { Configuration, MultiStats } from 'webpack';
import getWebpackClientConfig from './configs/webpack.client.config';
import getWebpackServerConfig from './configs/webpack.server.config';
import Logger from './utils/logger';
import { isWatch } from './utils/constants';

const errorFallback = (err?: Error | null, result?: MultiStats) => {
    if (err) {
        Logger.error(err);
    }
    if (!result) {
        return;
    }

    const rawMessages = result.toJson();
    if (rawMessages.errors) {
        rawMessages.errors.forEach((e) => {
            return Logger.error(e);
        });
        return `failed to compile!`;
    }
    if (rawMessages.warnings) {
        rawMessages.warnings.forEach((w) => {
            return Logger.warn(w);
        });
        Logger.warn(`compiled with warnings.`);
    }
    if (!rawMessages.errors && !rawMessages.warnings) {
        Logger.info(`compiled successfully!`);
    }
    return null;
};


const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];
const compiler = webpack(config);

if (isWatch) {
    compiler.watch({}, errorFallback);
} else {
    compiler.run(errorFallback);
}

export default config;
