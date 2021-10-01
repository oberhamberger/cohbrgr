import { resolve, dirname, join } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Mode, isProduction } from './webpack.config';

const CWD = process.cwd();

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: 'src/client',
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
            join(dirname(require.main.filename), '..', 'node_modules'),
            join(dirname(require.main.filename), 'node_modules'),
            'node_modules',
        ],
        alias: { src: 'src/' },
    },
    plugins: [
        new ESLintPlugin(),
        new WebpackBar({
            name: 'Client',
            color: '#99ccff',
        }),
    ],
    output: {
        path: resolve(__dirname, '../dist/client'),
        filename: 'bundle.js',
        clean: true,
    },
});
