#!/usr/bin/env node
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const eslintPkgPath = require.resolve('eslint/package.json');
const eslintPkg = require('eslint/package.json');
const eslintDir = dirname(eslintPkgPath);
const binRelative =
    typeof eslintPkg.bin === 'string' ? eslintPkg.bin : eslintPkg.bin.eslint;

require(join(eslintDir, binRelative));
