import { Configuration, ProgressPlugin } from 'webpack';
import { join, resolve, dirname } from 'path';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const CWD = process.cwd();
const {
    NODE_ENV = 'production',
}: any = process.env;

const config: Configuration = {
    mode: NODE_ENV,
    devtool: 'inline-source-map',
    target: 'node',
    entry: {
        server: resolve(__dirname, '../src/server'),
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            join(CWD, ''),
            join(CWD, 'node_modules'),
            join(dirname(require.main!.filename), '..', 'node_modules'),
            join(dirname(require.main!.filename), 'node_modules'),
            'node_modules'
          ],
        alias: { 'src': 'src' }
    },
    plugins: [
        new ProgressPlugin({
            activeModules: false,
            entries: true,
            handler(percentage, message, ...args) {
                console.info(percentage, message, ...args);
            },
            modules: true,
            modulesCount: 5000,
            profile: false,
            dependencies: true,
            dependenciesCount: 10000,
            percentBy: null,
          })
    ],
    output: {
        path: resolve(__dirname, '../dist/server/'),
        filename: 'index.js',
        clean: true
    },
};

export default config;