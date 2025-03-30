import { default as Enhanced } from '@module-federation/enhanced';
import { default as NFP } from '@module-federation/node';
import runtimePlugin from '@module-federation/node/runtimePlugin';

import packageJson from '../../../../package.json' with { type: "json" };

const { dependencies } = packageJson;
const { ModuleFederationPlugin } = Enhanced;
const { UniversalFederationPlugin } = NFP;

const getRemoteOptions = () => {
    return {
        exposes: {
            './Content': 'src/client/components/content',
        },
        shared: {
            ...dependencies,
            react: {
                singleton: true,
                requiredVersion: dependencies.react,
            },
            'react-dom': {
                singleton: true,
                requiredVersion: dependencies['react-dom'],
            },
        },
    };
};

export default () => {
    const clientFederationConfig = {
        filename: 'remoteEntry.js',
        name: 'content',
        bundlerRuntime: false,
        ...getRemoteOptions(),
    };

    const serverFederationConfig = {
        filename: 'remoteEntry.js',
        name: 'content',
        runtimePlugins: [runtimePlugin],

        isServer: true,
        library: { type: 'commonjs-module' },
        useRuntimePlugin: true,

        ...getRemoteOptions(),
    };

    return {
        client: new ModuleFederationPlugin(clientFederationConfig),
        server: new UniversalFederationPlugin(serverFederationConfig, {}),
    };
};
