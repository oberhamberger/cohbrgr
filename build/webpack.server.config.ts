import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import { Mode, isProduction } from './webpack.config';

const CWD = process.cwd();

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    target: 'node',
    entry: {
        server: resolve(__dirname, '../src/server'),
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
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
        alias: { src: 'src' },
    },
    plugins: [
        new WebpackBar({
            name: 'Server',
            color: '#ff50e1'
        }),
    ],
    output: {
        path: resolve(__dirname, '../dist/server/'),
        filename: 'index.js',
        clean: true,
        publicPath: '/',
    },

});
