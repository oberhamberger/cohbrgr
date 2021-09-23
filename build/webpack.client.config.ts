import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { Mode } from './webpack.config';

const CWD = process.cwd();

export default (isProduction: boolean): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    entry: {},
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
      minimize: true,
      minimizer: [
        new HtmlMinimizerPlugin(),
      ],
    },
    output: {
        path: resolve(__dirname, '../dist/'),
        clean: true,
    },
});
