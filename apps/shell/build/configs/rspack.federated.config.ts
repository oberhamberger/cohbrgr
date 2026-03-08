import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

import { Config } from '@cohbrgr/content/env';

import packageJson from '../../../../package.json';

const { dependencies } = packageJson;

// Config.port already returns the correct port based on NODE_ENV at build time
const contentUrl =
    process.env['DOCKER'] === 'true'
        ? Config.location
        : `${Config.location}:${Config.port}/`;

const getHostOptions = (isServer: boolean) => {
    return {
        name: 'shell',

        remotes: {
            content: `content@${contentUrl}${isServer ? 'server' : 'client'}/remoteEntry.js`,
        },
        shared: {
            react: {
                singleton: true,
                requiredVersion: dependencies.react,
            },
            'react-dom': {
                singleton: true,
                requiredVersion: dependencies['react-dom'],
            },
            '@tanstack/react-query': {
                singleton: true,
                requiredVersion: dependencies['@tanstack/react-query'],
            },
            '@cohbrgr/localization': {
                singleton: true,
                requiredVersion: false,
            },
        },
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
