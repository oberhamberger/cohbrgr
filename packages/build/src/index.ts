import webpack, { Configuration, MultiStats } from 'webpack';

import * as Utils from '@cohbrgr/utils';

import getWebpackClientConfig from 'src/configs/webpack.client.config';
import getWebpackServerConfig from 'src/configs/webpack.server.config';
import staticSiteGenerator from 'src/ssg';
import { isWatch, isSSG } from 'src/utils/constants';
const { Logger } = Utils;

const webpackconfigs = (async () => {

    const configs: [Configuration[]?] = [];

    configs.push([
        await getWebpackClientConfig(),
        await getWebpackServerConfig(),
    ]);

    return configs.forEach((config) => {
        if (!config) {
            console.error('No Config');
            throw 'No Config';
        }

        const compiler = webpack(config);
        const compilerCallback = (err?: Error | null, result?: MultiStats) => {
            if (err) {
                console.error(err.stack);
            }
            if (!result) {
                console.warn('Compiler returned no result.');
                throw 'No Result from Compiler';
            }

            const rawMessages = result.toJson();
            if (rawMessages.errors?.length) {
                rawMessages.errors.forEach((e) => {
                    console.error(e);
                });
                throw rawMessages.errors;
            }
            if (rawMessages.warnings?.length) {
                rawMessages.warnings.forEach((w) => {
                    console.warn(w);
                });
            }
            if (!rawMessages.errors?.length && !rawMessages.warnings?.length) {
                console.info(`compiled successfully.`);
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
})();


export default webpackconfigs;
