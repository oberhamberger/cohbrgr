import { isProduction } from '@cohbrgr/build';
import EnvironmentConfig from '@cohbrgr/environments';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { dependencies } from '../../../../package.json';

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

export default () => {

    const clientFederationConfig = {
        filename: 'container.js',
        name: 'shell',
        bundlerRuntime: false,
        ...(getHostOptions(false)),
    };

    const serverFederationConfig = {
        filename: 'remoteEntry.js',
        name:'shell',        
        library: { type: 'commonjs2' },
        ...(getHostOptions(true)),
    };

    return {
        client: new ModuleFederationPlugin(clientFederationConfig),
        server: new ModuleFederationPlugin(serverFederationConfig),
    };
};
