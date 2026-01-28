#!/usr/bin/env node
const { dirname, join } = require('node:path');

const pkgPath = require.resolve('jest/package.json');
const pkg = require('jest/package.json');
const pkgDir = dirname(pkgPath);
const binRelative = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.jest;

require(join(pkgDir, binRelative));
