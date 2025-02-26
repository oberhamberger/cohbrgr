import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
//import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { ModuleFederationPlugin, container } from '@module-federation/enhanced';
import { UniversalFederationPlugin } from '@module-federation/node';

const config = defineConfig({
  environments: {
    // web: {
    //   source: {
    //     entry: {
    //       index: './src/client/index.tsx',
    //     },
    //   },
    //   output: {
    //     target: 'web',
    //     cleanDistPath: true,
    //     cssModules: {
    //       namedExport: true,
    //     },
    //     distPath: {
    //       root: 'dist/client',
    //     },
    //   },
    //   tools: {
    //     rspack: (config, { appendPlugins }) => {
    //       if (config.output) {
    //         config.output.uniqueName = 'shell';
    //       }
    //       appendPlugins([
    //         new ModuleFederationPlugin({
    //           name: 'shell',
    //           remotes: {
    //             content:
    //               'content@http://localhost:3001/client/mf-manifest.json',
    //           },
    //           shared: ['react', 'react-dom'],
    //         }),
    //       ]);
    //     },
    //   },
    //   plugins: [pluginReact(), pluginSass()],
    // },
    node: {
      source: {
        entry: {
          index: './src/server/index.ts',
        },
      },
      output: {
        externals: {
          express: 'express'
        },
        target: 'node',
        cleanDistPath: true,
        cssModules: {
          namedExport: true,
        },
        minify: false,
        distPath: {
          root: 'dist/server',
        },
      },
      plugins: [pluginReact(), pluginSass()],
      tools: {
        rspack: (config, { appendPlugins }) => {
          appendPlugins([
            new UniversalFederationPlugin({
              isServer: true,
              name: 'shell',
              dts: false,
              remotes: {
                content:
                  'content@http://localhost:3001/server/mf-manifest.json',
              },
              useRuntimePlugin: true,
              //runtimePlugins: [require.resolve('@module-federation/node/runtimePlugin')],
              //remoteType: 'script',
              // library: { type: 'commonjs-module', name: 'shell' },
            }, {}),
          ]);
          console.log( config)

        },
      },
    },
  },
});

export default config;