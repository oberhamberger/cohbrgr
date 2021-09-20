import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { join, resolve, dirname } from 'path';

// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';


const CWD = process.cwd();

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production'
}

const isProduction = process.env.NODE_ENV === Mode.PRODUCTION;


const serverConfig: Configuration = {
    mode: true ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: true ? false : 'inline-source-map',
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
        color: 'yellow'
      }),
    ],
    output: {
        path: resolve(__dirname, '../dist/server/'),
        filename: 'index.js',
        clean: true,
    },
    
};

const clientConfig: Configuration = {
  mode: true ? Mode.PRODUCTION : Mode.DEVELOPMENT,
  entry: {
    server: resolve(__dirname, '../src/client'),
  },
  module: {
    rules: [
        {
          test: /\.html$/i,
          type: "asset/resource"
        },
    ],
  },
  resolve: {
    extensions: ['.html', '.json', '.js'],
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
      name: 'Client',
      color: 'blue'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./src/client",
          to: "./client/"
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin(),
    ],
  },
  output: {
      path: resolve(__dirname, '../dist/'),
      clean: true,
  },
}

export default [serverConfig, clientConfig];



// Generated using webpack-cli https://github.com/webpack/webpack-cli


