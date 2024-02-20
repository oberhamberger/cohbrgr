import webpack, { Configuration, MultiStats } from 'webpack';
import getWebpackClientConfig from 'src/configs/webpack.client.config';
import getWebpackServerConfig from 'src/configs/webpack.server.config';
import { isWatch, isSSG, isShell } from 'src/utils/constants';
import staticSiteGenerator from 'src/ssg';
import { Logger } from '@cohbrgr/utils';

const configs: [Configuration[]?] = [];
configs.push([getWebpackClientConfig(), getWebpackServerConfig()]);

console.log('isShell: ', isShell);

configs.forEach((config) => {
    if (!config) {
        return;
    }
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
});

export default configs;
