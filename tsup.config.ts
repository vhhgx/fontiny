import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'plugins/index': 'src/plugins/index.ts',
      'iconfont/index': 'src/iconfont/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'node18',
    splitting: false,
    external: ['fonteditor-core', 'svgtofont'],
  },
  {
    entry: {
      cli: 'src/cli.ts',
    },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    clean: false,
    target: 'node18',
    splitting: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['fonteditor-core', 'svgtofont'],
  },
])
