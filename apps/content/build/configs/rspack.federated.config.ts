import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

import packageJson from '../../../../package.json';

const { dependencies } = packageJson;

const getRemoteOptions = () => {
    return {
        name: 'content',
        filename: 'remoteEntry.js',

        exposes: {
            './Content': 'src/client/components/content',
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
        },
    };
};

export default () => {
    return {
        client: new ModuleFederationPlugin(getRemoteOptions()),
        server: new ModuleFederationPlugin({
            remoteType: 'script',
            library: { type: 'commonjs-module' },
            runtimePlugins: [
                require.resolve('@module-federation/node/runtimePlugin'),
            ],

            ...getRemoteOptions(),
        }),
    };
};
