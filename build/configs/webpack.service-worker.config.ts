import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import ESLintPlugin from 'eslint-webpack-plugin';
import WorkBoxPlugin from 'workbox-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackBar from 'webpackbar';
import { Mode, isProduction, CWD } from '../utils/constants';


const isAnalyze = process.env.ANALYZE === 'true';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: 'src/service-worker/bootstrap.ts',
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
        isAnalyze ? new BundleAnalyzerPlugin({
            generateStatsFile: true,
            openAnalyzer: true,
            analyzerPort: 0,
        }) : () => null,
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
        filename: 'registerSW.js'
    },
});
