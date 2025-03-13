import { Logger } from '@cohbrgr/utils';
import getWebpackClientConfig from 'src/configs/webpack.client.config';
import moduleFederationPlugin from 'src/configs/webpack.federated.config';
import getWebpackServerConfig from 'src/configs/webpack.server.config';
import staticSiteGenerator from 'src/ssg';
import { isSSG, isShell, isWatch } from 'src/utils/constants';
import webpack, { Configuration, MultiStats } from 'webpack';

const federationPlugins = moduleFederationPlugin(isShell);
const configs: [Configuration[]?] = [];

configs.push([
    getWebpackClientConfig(federationPlugins.client),
    getWebpackServerConfig(federationPlugins.server),
]);

configs.forEach((config) => {
    if (!config) {
        Logger.error('No Config');
        throw 'No Config';
    }

    const compiler = webpack(config);
    const compilerCallback = (err?: Error | null, result?: MultiStats) => {
        if (err) {
            Logger.error(err.stack);
        }
        if (!result) {
            Logger.warn('Compiler returned no result.');
            throw 'No Result from Compiler';
        }

        const rawMessages = result.toJson();
        if (rawMessages.errors?.length) {
            rawMessages.errors.forEach((e) => {
                Logger.error(e);
            });
            throw rawMessages.errors;
        }
        if (rawMessages.warnings?.length) {
            rawMessages.warnings.forEach((w) => {
                Logger.warn(w);
            });
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
