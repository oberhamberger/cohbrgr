import { defineConfig } from '@rslib/core';
import { pluginSass } from '@rsbuild/plugin-sass';


export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
  ],
  plugins: [ pluginSass(), ],
  output: { target: 'node' },
});
