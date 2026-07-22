// The base tsconfig pins an explicit `typeRoots`, so a `types` entry of
// "vitest/globals" cannot resolve (entries are looked up inside typeRoots,
// not as packages). This shim lives in a typeRoot and forwards to the real
// declarations, making describe/it/expect/vi ambient for `globals: true`.
/// <reference types="vitest/globals" />
