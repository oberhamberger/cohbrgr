import { isProduction } from '@cohbrgr/build';
import { Config } from '@cohbrgr/content/env';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

import packageJson from '../../../../package.json';

const { dependencies } = packageJson;

const contentPort = isProduction ? Config.port : Config.port + 30;
const contentUrl =
    process.env['DOCKER'] === 'true'
        ? Config.location
        : `${Config.location}:${contentPort}/`;

const getHostOptions = (isServer: boolean) => {
    return {
        name: 'shell',

        remotes: {
            content: `content@${contentUrl}${isServer ? 'server' : 'client'}/remoteEntry.js`,
        },
        shared: [
            {
                react: dependencies.react,
                'react-dom': dependencies['react-dom'],
            },
        ],
    };
};

export default () => {
    return {
        client: new ModuleFederationPlugin({
            filename: 'container.js',
            ...getHostOptions(false),
        }),
        server: new ModuleFederationPlugin({
            remoteType: 'script',
            filename: 'remoteEntry.js',
            library: { type: 'commonjs-module' },
            runtimePlugins: [
                require.resolve('@module-federation/node/runtimePlugin'),
            ],

            ...getHostOptions(true),
        }),
    };
};
