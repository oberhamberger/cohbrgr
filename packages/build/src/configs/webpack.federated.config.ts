import { UniversalFederationPlugin } from '@module-federation/node';
import { dependencies } from '../../../../package.json';

const serverLibraryConfig = {
    library: { type: 'commonjs-module' },
}

export default (isServer: boolean, isShell: boolean) => {
    const remoteEntryLocation = isServer ? 'server' : 'client';
    const filename = isServer || !isShell ? 'remoteEntry.js' : 'container.js';

    const baseUniversalFederationOptions = {
        name: isShell ? 'shell' : 'content',
        filename: filename,
        isServer: isServer,
        ...(isServer ? serverLibraryConfig : {}),
        // shared: {
        //     ...(isShell ? dependencies : {}),
        //     react: {
        //         ...(isShell ? {} : {singleton: true}),
        //         requiredVersion: dependencies.react,
        //     },
        //     'react-dom': {
        //         ...(isShell ? {} : {singleton: true}),
        //         requiredVersion: dependencies['react-dom'],
        //     },
        // },
    };

    const universalFederationOptions = isShell ? {
        ...baseUniversalFederationOptions,
        remotes: {
            content: `content@http://localhost:3001/${remoteEntryLocation}/remoteEntry.js`,
        },
    } : {
        ...baseUniversalFederationOptions,
        exposes: {
            './Content': 'src/client/components/Content',
        },
    };


    return [
            new UniversalFederationPlugin(universalFederationOptions, {}),
        ]
};
