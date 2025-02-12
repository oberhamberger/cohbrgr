import { resolve, join } from 'path';
import { type Configuration } from '@rspack/core';
import { UniversalFederationPlugin } from '@module-federation/node';
import {
    isProduction,
    regexStyle,
    regexTypescript,
    Mode,
    CWD,
    isShell
} from 'src/utils/constants';
import EnvironmentConfig from '@cohbrgr/environments';

export default (federationOptions: any): Configuration => {
    return {
        entry: './server/index.ts',
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        context: resolve(CWD, `./src`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [join(CWD, 'node_modules'), join(CWD, '../..', 'node_modules')],
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: regexTypescript,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: regexStyle,
                    use: [
                        {
                            loader: 'sass-loader',
                            options: {
                                // using `modern-compiler` and `sass-embedded` together significantly improve build performance,
                                // requires `sass-loader >= 14.2.1`
                                api: 'modern-compiler',
                                implementation: require.resolve('sass-embedded'),
                            },
                        },
                    ],
                    // set to 'css/auto' if you want to support '*.module.(scss|sass)' as CSS Modules, otherwise set type to 'css'
                    type: 'css/auto',
                },
            ],
        },
        plugins: [
            ...(federationOptions ? [new UniversalFederationPlugin(federationOptions, {})] : []),
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: 'index.js',
            clean: true,
            publicPath: `localhost:${isShell ? EnvironmentConfig.shell.port : EnvironmentConfig.content.port}/`
        },
        externals: {
            express: "import express",
        }
    };
};
