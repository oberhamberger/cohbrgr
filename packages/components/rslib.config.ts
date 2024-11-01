import { defineConfig } from "@rslib/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
// import { pluginTypedCSSModules } from "@rsbuild/plugin-typed-css-modules";

const shared = {
	dts: {
		bundle: false,
	},
    plugins: [
        pluginReact(),
        pluginSass(),
        // pluginTypedCSSModules()
    ],
};

const externals = {
    react: 'react',
    'react-dom': 'react-dom',
    'react/jsx-runtime': 'react/jsx-runtime',
};

export default defineConfig({
	lib: [
		{
			...shared,
			format: "esm",
			output: {
				distPath: {
					root: "./dist/esm",
				},
                externals: {
                    ...externals
                }
			}
		},
		{
			...shared,
			format: "cjs",
			output: {
				distPath: {
					root: "./dist/cjs",
				},
                externals: {
                    ...externals
                }
            },
		}
	],
    output: {
        minify: false
    },
});