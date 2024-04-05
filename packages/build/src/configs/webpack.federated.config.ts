import EnvironmentConfig from '@cohbrgr/environments';
import { UniversalFederationPlugin } from '@module-federation/node';
import { dependencies } from '../../../../package.json';
import { isProduction } from 'src/utils/constants';

const contentPort = isProduction
    ? EnvironmentConfig.content.port
    : EnvironmentConfig.content.port + 30;

const contentUrl =
    process.env?.DOCKER === 'true'
        ? EnvironmentConfig.content.location
        : `${EnvironmentConfig.content.location}:${contentPort}/`;

console.log(contentUrl);

const getContainerOptions = (isServer: boolean) => {
    return {
        remotes: {
            content: `content@${contentUrl}${isServer ? 'server' : 'client'}/remoteEntry.js`,
        },
        // shared: [{ react: dependencies.react, 'react-dom': dependencies['react-dom'] }]
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
        isServer: true,
        library: { type: 'commonjs-module' },
        ...(isShell ? getContainerOptions(true) : getRemoteOptions()),
    };
};

const getClientFederationConfig = (isShell: boolean) => {
    return {
        filename: !isShell ? 'remoteEntry.js' : 'container.js',
        name: isShell ? 'shell' : 'content',
        isServer: false,
        ...(isShell ? getContainerOptions(false) : getRemoteOptions()),
    };
};

export default (isShell: boolean) => {
    const clientFederationConfig = getClientFederationConfig(isShell);
    const serverFederationConfig = getServerFederationConfig(isShell);

    return {
        client: new UniversalFederationPlugin(clientFederationConfig, {}),
        server: new UniversalFederationPlugin(serverFederationConfig, {}),
    };
};
