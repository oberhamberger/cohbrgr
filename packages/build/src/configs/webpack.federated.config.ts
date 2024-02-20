import { UniversalFederationPlugin } from '@module-federation/node';
import { container } from 'webpack';
import { dependencies } from '../../../../package.json';

const serverLibraryConfig = {
    isServer: true,
    library: { type: 'commonjs-module' },
};

const getServerFederationConfig = (isShell: boolean) => {
    return {
        name: isShell ? 'shell' : 'content',
        isServer: true,
        library: { type: 'commonjs-module' },
    }
}

const getClientFederationConfig = (isShell: boolean) => {
    return {
        name: isShell ? 'shell' : 'content',
    }
}

export default (isServer: boolean, isShell: boolean) => {
    const remoteEntryLocation = isServer ? 'server' : 'client';
    const filename = isServer || !isShell ? 'remoteEntry.js' : 'container.js';

    const universalFederationOptions = isShell
        ? {
              remotes: {
                  content: `content@http://localhost:3001/${remoteEntryLocation}/remoteEntry.js`,
              },
          }
        : {
              exposes: {
                  './Content': 'src/client/components/Content',
              },
          };

    return [
        isServer
            ? new UniversalFederationPlugin(
                  {
                    ...getServerFederationConfig(isShell),
                    filename: filename,
                    ...universalFederationOptions
                },
                  {},
              )
            : new container.ModuleFederationPlugin( {
                ...getClientFederationConfig(isShell),
                filename: filename,
                ...universalFederationOptions
            },),
    ];
};
