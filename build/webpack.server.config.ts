import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Mode, isProduction } from './webpack.config';

const CWD = process.cwd();

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: 'src/server',
    target: 'node',
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
            join(dirname(require.main!.filename), '..', 'node_modules'),
            join(dirname(require.main!.filename), 'node_modules'),
            'node_modules',
        ],
        alias: { src: 'src/server' },
    },
    plugins: [
        new ESLintPlugin(),
        new WebpackBar({
            name: 'Server',
            color: '#ff50e1'
        }),
        new NodemonPlugin()
    ],
    output: {
        path: resolve(__dirname, '../dist/server/'),
        filename: 'index.js',
        clean: true,
        publicPath: '/',
    }
});
