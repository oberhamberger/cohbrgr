import { type Configuration, type MultiStats, rspack } from '@rspack/core';

import { Logger } from '@cohbrgr/utils';
import getRspackClientConfig from 'src/configs/rspack.client.config';
import getRspackServerConfig from 'src/configs/rspack.server.config';
//import moduleFederationPlugin from 'src/configs/rspack.federated.config';
import staticSiteGenerator from 'src/ssg';
import { isWatch, isSSG } from 'src/utils/constants';

// const federationPlugins = moduleFederationPlugin(isShell);
const configs: [Configuration[]?] = [];

configs.push([
    getRspackClientConfig(),
    getRspackServerConfig(),
]);


configs.forEach((config) => {
    if (!config) {
        Logger.error('No Config');
        throw 'No Config';
    }

    const compiler = rspack(config);
    const compilerCallback = (err: Error | null, result: MultiStats | undefined) => {
        if (err) {
            Logger.error(err.stack);
        }
        if (!result) {
            Logger.warn('Compiler returned no result.');
            throw 'No Result from Compiler';
        }

        const rawMessages = result.toJson({});
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
        try {

            compiler.run(compilerCallback);
        } catch (e) {
            Logger.error(e);
        }
    }
});
