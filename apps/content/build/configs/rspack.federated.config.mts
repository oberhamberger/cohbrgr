import { default as Enhanced } from '@module-federation/enhanced';
import { default as NFP } from '@module-federation/node';

import packageJson from '../../../../package.json' with { type: "json" };

const { dependencies } = packageJson;
const { ModuleFederationPlugin } = Enhanced;
const { UniversalFederationPlugin } = NFP;

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
        //@ts-expect-error no example given for plugin context
        server: new UniversalFederationPlugin({
            library: { type: 'commonjs-module' },
            isServer: true,
    
            ...getRemoteOptions(),
        }),
    };
};
