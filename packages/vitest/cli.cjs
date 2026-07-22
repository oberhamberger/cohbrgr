#!/usr/bin/env node
const { dirname, join } = require('node:path');

const pkgPath = require.resolve('vitest/package.json');
const pkg = require('vitest/package.json');
const pkgDir = dirname(pkgPath);
const binRelative = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.vitest;

require(join(pkgDir, binRelative));
