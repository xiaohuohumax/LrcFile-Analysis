
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import license from 'rollup-plugin-license';
import resolve from '@rollup/plugin-node-resolve';
import { builtinModules } from 'node:module';
import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));

const entries = {
  index: './src/index.ts'
};

const banner = `/**
 * ${packageJson.name} ${packageJson.version}
 * Copyright (c) 2020-present ${packageJson.author}
 * @license ${packageJson.license}
 */`;

function initPlugins(minify = false) {
  return [
    resolve(),
    esbuild({ minify }),
    json(),
    license({ banner })
  ];
}

const external = [
  ...builtinModules,
  '@xiaohuohumax/lrc-parser'
];

export default defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
    },
    plugins: initPlugins(),
    external
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    plugins: initPlugins(),
    external
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      format: 'esm',
    },
    plugins: [
      dts({ respectExternal: true }),
    ],
    external
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'umd',
      name: 'Lu',
      entryFileNames: 'lrc-util.min.js',
      globals: {
        '@xiaohuohumax/lrc-parser': 'Lp'
      }
    },
    plugins: initPlugins(true),
    external
  },
]);