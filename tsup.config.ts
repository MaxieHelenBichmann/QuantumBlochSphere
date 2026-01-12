import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'three'],
  esbuildOptions(options) {
    // Preserve 'use client' directive for Next.js compatibility
    options.banner = {
      js: '"use client";',
    };
  },
  platform: 'browser',
  target: 'es2020',
});
