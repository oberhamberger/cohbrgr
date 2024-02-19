import { build } from 'esbuild';
import { readFileSync } from 'fs';

const rawPackageJson = readFileSync('./package.json', { encoding: 'utf8' });
const packageJson = JSON.parse(rawPackageJson);

const options = {
    entryPoints: ['./src/index.ts'],
    bundle: true,

    platform: 'node',
    outfile: 'bin/index.js',
    sourcemap: false,
    minify: true,
    banner: {
        js: '#!/usr/bin/env node'
    },
    external: [
        ...Object.keys(packageJson.dependencies),
        './worker',
        './threadChild',
        './processChild',
    ],
};

build(options)
    .then(() => {
        console.info('Building success!\n');
    })
    .catch(() => process.exit(1));
