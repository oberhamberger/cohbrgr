#!/usr/bin/env node
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkgPath = require.resolve('prettier/package.json');
const pkg = require('prettier/package.json');
const pkgDir = dirname(pkgPath);
const binRelative = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.prettier;

import(join(pkgDir, binRelative));
