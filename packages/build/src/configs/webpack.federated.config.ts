import {
    UniversalFederationPlugin,
} from '@module-federation/node';
import { container } from 'webpack';
import { dependencies } from '../../../../package.json';

const getServerFederationConfig = (isShell: boolean) => {
    return {
        name: isShell ? 'shell' : 'content',
        isServer: true,
        // library: { type: 'commonjs-module' },
    }
}

const getClientFederationConfig = (isShell: boolean) => {
    return {
        name: isShell ? 'shell' : 'content',
        isServer: false,
    }
}

export default (isServer: boolean, isShell: boolean) => {
    const remoteEntryLocation = isServer ? 'server' : 'client';
    const filename = isServer || !isShell ? 'remoteEntry.js' : 'container.js';

    const universalFederationOptions = isShell
        ? {
              remotes: {
                  content: `content@http://localhost:3031/${remoteEntryLocation}/remoteEntry.js`,
              },
          }
        : {

              exposes: {
                  './Content': 'src/client/components/content',
              },
          };

    const serverFederationConfig = {
        ...getServerFederationConfig(isShell),
        filename: filename,
        ...universalFederationOptions,
    };

    const clientFederationConfig = {
        ...getClientFederationConfig(isShell),
        filename: filename,
        ...universalFederationOptions,
    };

    console.log('isShell: ', isShell);
    console.log(serverFederationConfig);
    console.log(clientFederationConfig);

    return {
        server: new UniversalFederationPlugin(serverFederationConfig, container),
        client: new UniversalFederationPlugin(clientFederationConfig, {}),
    };
};
