import { resolve } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Mode, isProduction } from './webpack.config';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: {},
    plugins: [
      new ESLintPlugin(),
      new WebpackBar({
        name: 'Client',
        color: 'aquamarine'
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
      minimize: isProduction,
      minimizer: isProduction ? [
         new HtmlMinimizerPlugin(),
      ] : [],
    },
    output: {
        path: resolve(__dirname, '../dist/'),
        clean: true,
    },
});
