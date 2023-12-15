import { container } from 'webpack';
import { dependencies } from '../../package.json';

export default {
    shell: new container.ModuleFederationPlugin({
        name: 'shell',
        filename: 'container.js',
        remotes: {
            remote1: 'remote1@http://localhost:3001/shell/remoteEntry.js',
        },
        shared: [
            {
                react: dependencies.react,
                'react-dom': dependencies['react-dom'],
            },
        ],
    }),
    content: new container.ModuleFederationPlugin({
        name: 'remote2',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
            './content': './content',
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
    }),
};
