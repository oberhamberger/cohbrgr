declare module 'html-minimizer-webpack-plugin' {
    import webpack from 'webpack';

    interface HtmlMinimizerPluginOptions {

    }

    export default class HtmlMinimizerPlugin {
        apply: (compiler: webpack.Compiler) => void;

        constructor(options?: HtmlMinimizerPluginOptions);
    }
}