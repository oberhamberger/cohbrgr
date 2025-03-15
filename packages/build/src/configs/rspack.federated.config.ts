import EnvironmentConfig from '@cohbrgr/environments';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { dependencies } from '../../../../package.json';
import { isProduction } from '../utils/constants';

const contentPort = isProduction
    ? EnvironmentConfig.content.port
    : EnvironmentConfig.content.port + 30;

const contentUrl =
    process.env['DOCKER'] === 'true'
        ? EnvironmentConfig.content.location
        : `${EnvironmentConfig.content.location}:${contentPort}/`;

const getHostOptions = (isServer: boolean) => {
    return {
        remotes: {
            content: `content@${contentUrl}${isServer ? 'server' : 'client'}/remoteEntry.js`,
        },
        shared: [{ react: dependencies.react, 'react-dom': dependencies['react-dom'] }]
    };
};

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

const getServerFederationConfig = (isShell: boolean) => {
    return {
        filename: 'remoteEntry.js',
        name: isShell ? 'shell' : 'content',
        // isServer: true,
        
        library: { type: 'commonjs2' },
        ...(isShell ? getHostOptions(true) : getRemoteOptions()),
    };
};

const getClientFederationConfig = (isShell: boolean) => {
    return {
        filename: isShell ? 'container.js': 'remoteEntry.js',
        name: isShell ? 'shell' : 'content',
        bundlerRuntime: false,
        ...(isShell ? getHostOptions(false) : getRemoteOptions()),
    };
};

export const getModuleFederationPlugins = (isShell: boolean) => {
    const clientFederationConfig = getClientFederationConfig(isShell);
    const serverFederationConfig = getServerFederationConfig(isShell);

    return {
        client: new ModuleFederationPlugin(clientFederationConfig),
        server: new ModuleFederationPlugin(serverFederationConfig),
    };
};
