import { defineConfig } from '@rslib/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
  ],
  plugins: [ pluginReact(), pluginSass(), ],
  output: { target: 'node' },
});
