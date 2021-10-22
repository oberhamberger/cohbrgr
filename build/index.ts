import { Configuration } from 'webpack';
import getWebpackClientConfig from './configs/webpack.client.config';
import getWebpackServerConfig from './configs/webpack.server.config';
import getWebpackServiceWorkerConfig from './configs/webpack.service-worker.config';

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}
export const regexStyle = /\.(s?[ac]ss)$/;
export const regexGlobalStyle = /global\.(s?[ac]ss)$/;
export const regexModuleStyles = /\.module\.(s?[ac]ss)$/;
export const regexTypescript = /\.(ts|tsx)$/;
export const regexSource = /\.(ts|tsx|js|jsx)$/;
export const regexFonts = /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/;
export const regexFiles = /\.(png|jp(e*)g|ico|svg)$/;

export const isProduction = process.env.NODE_ENV === Mode.PRODUCTION;

export const CWD = process.cwd();

const config: Configuration[] = [
    getWebpackClientConfig(),
    getWebpackServerConfig(),
    getWebpackServiceWorkerConfig(),
];

export default config;
