import { isProduction } from '@cohbrgr/build';
import { Config } from '@cohbrgr/content/env';
import { default as Enhanced } from '@module-federation/enhanced/rspack';
import { default as NFP } from '@module-federation/node';
import { default as NFRuntime } from '@module-federation/node/runtimePlugin';
import packageJson from '../../../../package.json' with { type: "json" };

const { dependencies } = packageJson;
const { ModuleFederationPlugin } = Enhanced;
const { NodeFederationPlugin } = NFP;

const runtimePlugin = NFRuntime.default()

const contentPort = isProduction
    ? Config.local.port
    : Config.local.port + 30;

const contentUrl =
    process.env['DOCKER'] === 'true'
        ? Config.docker.location
        : `${Config.local.location}:${contentPort}/`;

const getHostOptions = (isServer: boolean) => {
    return {
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
            name: 'shell',
            ...getHostOptions(false),
        }),
        server: new NodeFederationPlugin({
            name: 'shell',
            filename: 'remoteEntry.js',
            library: { type: 'commonjs-module' },
            remoteType: 'script',
            runtimePlugins: [runtimePlugin.name],

            ...getHostOptions(true),
        }, {}),
    };
};
