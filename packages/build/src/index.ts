import { readdirSync } from 'fs';
import webpack, { Configuration, MultiStats } from 'webpack';
import getWebpackClientConfig from 'build/build/src/configs/webpack.client.config';
import getWebpackServerConfig from 'build/build/src/configs/webpack.server.config';
import Logger from 'build/build/src/utils/logger';
import { isWatch, isSSG } from 'build/build/src/utils/constants';
import staticSiteGenerator from 'build/build/src/ssg';

const packages = readdirSync('./packages/');
const configs: [Configuration[]?] = [];
packages.forEach(pack => {
    configs.push([
        getWebpackClientConfig(pack),
        getWebpackServerConfig(pack),
    ]);
})

configs.forEach(config => {
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
})


export default configs;
