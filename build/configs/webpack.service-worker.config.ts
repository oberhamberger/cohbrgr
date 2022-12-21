import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import ESLintPlugin from 'eslint-webpack-plugin';
import WorkBoxPlugin from 'workbox-webpack-plugin';
import WebpackBar from 'webpackbar';
import { Mode, isProduction, CWD } from '../utils/constants';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: 'src/service-worker',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            join(CWD, ''),
            join(CWD, 'node_modules'),
            join(dirname(require?.main?.filename || ''), '..', 'node_modules'),
            join(dirname(require?.main?.filename || ''), 'node_modules'),
            'node_modules',
            'node_modules',
        ],
        alias: { src: 'src/' },
    },
    plugins: [
        new WorkBoxPlugin.InjectManifest({
            swSrc: 'src/service-worker',
            swDest: 'sw.js',
            include: [/\.js$/, /\.css$/],
        }),
        new ESLintPlugin(),
        new WebpackBar({
            name: 'Service Worker',
            color: 'aquamarine',
        }),
    ],
    output: {
        path: resolve(__dirname, '../../dist/client/'),
    },
});
