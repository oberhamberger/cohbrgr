import { resolve, dirname } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetUseItem } from 'webpack';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename);

export default (isServer: boolean, isProduction: boolean): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'css-loader',
            options: {
                modules: {
                    exportOnlyLocals: isServer,
                    exportLocalsConvention: 'camelCase',
                    exportGlobals: true,
                    localIdentContext: resolve(__dirname, 'src'),
                    getLocalIdent: (context: any, localIdentName: string, localName: string) => {
                        if (
                          context.resourcePath.includes("node_modules") ||
                          context.resourcePath.includes("packages/components")
                        ) {
                          return localName; // Return the original class name (no hashing)
                        }

                        const hash = crypto
                            .createHash("md5") // You can choose another algorithm if preferred
                            .update(context.resourcePath + localIdentName)
                            .digest("base64")
                            .substr(0, isProduction ? 8 : 3); // Take the first 5 characters of the hash
      
                        // Use CSS Modules naming convention for local styles
                        return isProduction ? hash : `${localName}__${hash}`;
                      },
                },
                esModule: true,
                importLoaders: 1,
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'sass-loader',
        },
    ];

    const clientLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            esModule: true,
        },
    };

    !isServer && loaders.unshift(clientLoader);

    return loaders;
};
