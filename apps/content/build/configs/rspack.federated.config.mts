import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { dependencies } from '../../../../package.json';


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
        ...(getRemoteOptions()),
    };

    const serverFederationConfig = {
        filename: 'remoteEntry.js',
        name: 'content',
        
        library: { type: 'commonjs2' },
        ...(getRemoteOptions()),
    };

    return {
        client: new ModuleFederationPlugin(clientFederationConfig),
        server: new ModuleFederationPlugin(serverFederationConfig),
    };
};
