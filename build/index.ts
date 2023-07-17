import webpack, { Configuration, MultiStats } from 'webpack';
import getWebpackClientConfig from 'build/configs/webpack.client.config';
import getWebpackServerConfig from 'build/configs/webpack.server.config';
import Logger from 'build/utils/logger';
import { isWatch } from 'build/utils/constants';

const errorFallback = (err?: Error | null, result?: MultiStats) => {
    if (err) {
        Logger.error(err);
    }
    if (!result) {
        return;
    }

    const rawMessages = result.toJson();
    if (rawMessages.errors?.length) {
        rawMessages.errors.forEach((e) => {
            return Logger.error(e);
        });
        Logger.error(JSON.stringify(rawMessages.errors));
    }
    if (rawMessages.warnings?.length) {
        rawMessages.warnings.forEach((w) => {
            return Logger.warn(w);
        });
        Logger.warn(JSON.stringify(rawMessages.warnings));
    }
    if (!rawMessages.errors?.length && !rawMessages.warnings?.length) {
        Logger.info(`compiled successfully.`);
    }
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
