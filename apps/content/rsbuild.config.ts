import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';


export default defineConfig({
  environments: {
    client: {
      source: {
        entry: {
          index: './src/client/index.tsx',
        },
      },
      output: {
        distPath: {
          root: 'dist/client'
        },
        target: 'web',
      },
    },
    server: {
      source: {
        entry: {
          index: './src/server/index.ts',
        },
      },
      output: {
        externals: {
          "express": "import express"
        },
        distPath: {
          root: 'dist/server'
        },
        target: 'node',
      },
    },
  },
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginModuleFederation({
      name: 'federation_provider',
      exposes: {
        './content': './src/client/components/content/index.ts',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  output: {
    cleanDistPath: true,
    cssModules: {
      namedExport: true,
    },
  },
});
