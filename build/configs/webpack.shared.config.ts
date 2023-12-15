import { resolve, dirname, join } from 'path';
import { Configuration } from 'webpack';
import { Mode, isProduction, CWD } from 'build/utils/constants';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    context: resolve(__dirname, './packages'),
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        modules: [
            join(CWD, ''),
            join(CWD, 'node_modules'),
            join(dirname(require.main?.filename || ''), '..', 'node_modules'),
            join(dirname(require.main?.filename || ''), 'node_modules'),
            'node_modules',
            'node_modules',
        ],
        alias: { packages: 'packages/' },
    },
});
