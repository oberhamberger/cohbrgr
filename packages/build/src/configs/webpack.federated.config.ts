import EnvironmentConfig from '@cohbrgr/environments';
import { UniversalFederationPlugin } from '@module-federation/node';
import { dependencies } from '../../../../package.json';
import { isProduction } from 'src/utils/constants';

const contentPort = EnvironmentConfig.content.port;
const contentUrl =
    process.env?.DOCKER === 'true'
        ? EnvironmentConfig.content.location
        : `${EnvironmentConfig.content.location}:${contentPort}/`;

const getContainerOptions = (isServer: boolean) => {
    return {
        remotes: {
            content: `content@${contentUrl}${isServer ? 'server' : 'client'}/remoteEntry.js`,
        }
    };
};

const getRemoteOptions = () => {
    return {
        exposes: {
            './Content': 'src/client/components/content',
        },
    };
};

const getServerFederationConfig = (isShell: boolean) => {
    return {
        filename: 'remoteEntry.js',
        name: isShell ? 'shell' : 'content',
        isServer: true,
        dts: false,

        ...(isShell ? getContainerOptions(true) : getRemoteOptions()),
    };
};

const getClientFederationConfig = (isShell: boolean) => {
    return {
        filename: !isShell ? 'remoteEntry.js' : 'container.js',
        name: isShell ? 'shell' : 'content',
        dts: false,
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
