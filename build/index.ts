import webpack, { Configuration, MultiStats } from 'webpack';
import getWebpackClientConfig from 'build/configs/webpack.client.config';
import getWebpackServerConfig from 'build/configs/webpack.server.config';
import Logger from 'build/utils/logger';
import { isWatch, isSSG } from 'build/utils/constants';
import staticSiteGenerator from 'build/ssg';

const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
];
const compiler = webpack(config);

const compilerCallback = (err?: Error | null, result?: MultiStats) => {
    if (err) {
        Logger.error(err);
    }
    if (!result) {
        Logger.warn('Compiler returned no result.');
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

    if (isSSG) {
        staticSiteGenerator();
    }
};

if (isWatch) {
    compiler.watch({}, compilerCallback);
} else {
    compiler.run(compilerCallback);
}

export default config;
