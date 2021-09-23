import { resolve, join } from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import WebpackBar from 'webpackbar';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Mode, isProduction } from './webpack.config';
import {} from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export default (): Configuration => ({
  mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
  devtool: isProduction ? false : 'inline-source-map',
  entry: {},
  devServer: {
    static: {
      directory: join(__dirname, '../src/client'),
      watch: true
    },
    port: 3100
  },
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
