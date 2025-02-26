import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { ModuleFederationPluginWebpack } from '@module-federation/enhanced/webpack';
import { UniversalFederationPlugin } from '@module-federation/node';

export default defineConfig({
  environments: {
    web: {
      source: {
        entry: {
          index: './src/client/index.tsx',
        },
      },
      output: {
        target: 'web',
        distPath: {
          root: 'dist/client',
        },
      },
      tools: {
        rspack: (config, { appendPlugins }) => {
          if (config.output) {
            config.output.uniqueName = 'content';
            // publicPath must be configured if using manifest
            config.output.publicPath = 'http://localhost:3001/client/';
          }
          appendPlugins([
            new ModuleFederationPlugin({
              filename: 'remoteEntry.js',
              name: 'content',
              shared: ['react', 'react-dom'],
              exposes: {
                './content': './src/client/components/content/Content.tsx',
              },
            }),
          ]);
        },
      },
    },
    node: {
      source: {
        entry: {
          index: './src/server/index.ts',
        },
      },
      output: {
        target: 'node',
        externals: {
          express: 'import express',
        },
        distPath: {
          root: 'dist/server',
        },
      },
      tools: {
        rspack: (config, { appendPlugins }) => {
          if (config.output) {
            config.output.uniqueName = 'content';
            // publicPath must be configured if using manifest
            config.output.publicPath = 'http://localhost:3001/server/';
          }
          config.target = 'async-node';
          appendPlugins([
            new ModuleFederationPlugin({
              filename: 'remoteEntry.js',
              name: 'content',
              exposes: {
                './content': './src/client/components/content/Content.tsx',
              },
              shared: ['react', 'react-dom'],
              library: {
                type: 'commonjs-module',
                name: 'content'
              },
              runtimePlugins: [
                require.resolve('@module-federation/node/runtimePlugin')
              ]
            }
          ),
          ]);
        },
      },
    },
  },
  plugins: [pluginReact(), pluginSass()],
  output: {
    cleanDistPath: true,
    cssModules: {
      namedExport: true,
    },
  },
});
