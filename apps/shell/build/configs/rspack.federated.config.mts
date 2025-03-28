import { isProduction } from '@cohbrgr/build';
import { Config } from '@cohbrgr/content/env';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import packageJson from '../../../../package.json' with { type: "json" };

const { dependencies } = packageJson;

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
    const clientFederationConfig = {
        filename: 'container.js',
        name: 'shell',
        bundlerRuntime: false,
        ...getHostOptions(false),
    };

    const serverFederationConfig = {
        name: 'shell',
        filename: 'remoteEntry.js',
        isServer: true,
        library: { type: 'commonjs-module' },
        ...getHostOptions(true),
    };

    return {
        client: new ModuleFederationPlugin(clientFederationConfig),
        server: new ModuleFederationPlugin(serverFederationConfig),
    };
};
