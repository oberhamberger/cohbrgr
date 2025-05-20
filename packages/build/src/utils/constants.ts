import { findProcessArgs } from './helpers';

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

export const serviceWorker = 'sw.js';

export const regexStyle = /\.(s?[ac]ss)$/;
export const regexGlobalStyle = /global\.(s?[ac]ss)$/;
export const regexModuleStyles = /\.module\.(s?[ac]ss)$/;
export const regexTypescript = /\.(ts|tsx)$/;
export const regexSource = /\.(ts|tsx|js|jsx)$/;
export const regexFonts = /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/;
export const regexFiles = /\.(png|jp(e*)g|ico|svg)$/;

export const isProduction = process.env['NODE_ENV'] === Mode.PRODUCTION;
export const isDevelopment =
    process.env['NODE_ENV'] === Mode.DEVELOPMENT || !isProduction;
export const CWD = process.cwd();
export const isShell = CWD.includes('shell');
export const isWatch = isDevelopment || findProcessArgs(['--watch', '-w']);
export const isAnalyze = findProcessArgs(['--analyze']);
export const isSSG = findProcessArgs(['--generator']);
export const port = process.env['PORT'] || isProduction ? 3000 : 3030;

export const isCloudRun = !!process.env['GCLOUD_RUN'];
