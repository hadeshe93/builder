import path from 'path';
import { RollupOptions, OutputOptions } from 'rollup';
import fs from 'fs-extra';
// import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import { getNodeModulePaths, getRequireResolve } from '@hadeshe93/lib-node';

interface CreateRollupConfigOptions {
  // rollup 配置
  input: string;
  format: OutputOptions['format'];
  sourcemap: OutputOptions['sourcemap'];
  external?: RollupOptions['external'];
  plugins?: RollupOptions['plugins'];

  // 自定义配置
  target: 'node' | 'browser' | 'common';
  define?: Record<string, any>;
  useTerser?: boolean;
  browserslist?: string | string[] | Record<string, string | string[]>;
}

// 目标构建类型
export const BUILD_FORMATS = {
  CJS: 'cjs',
  ESM: 'esm',
  IIFE: 'iife',
};

export function createRollupConfig(options: CreateRollupConfigOptions) {
  const nodeModulePaths = getNodeModulePaths([path.resolve('./')]);
  const requireResolve = getRequireResolve(nodeModulePaths);
  const { input, format, sourcemap, browserslist, plugins } = formatCreateRollupConfigOptions(options);
  const output = {
    format,
    sourcemap,
    exports: 'auto',
  };
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'];
  const babelPlugin = babel({
    extensions,
    babelrc: false,
    babelHelpers: format === 'iife' ? 'bundled' : 'runtime',
    presets: [
      [
        requireResolve('@babel/preset-env'),
        {
          modules: format === BUILD_FORMATS.ESM ? false : 'auto',
          useBuiltIns: 'usage',
          corejs: 3,
          targets: browserslist,
        },
      ],
      [
        requireResolve('@babel/preset-typescript'),
        {
          allExtensions: true,
        },
      ],
    ],
    plugins: [
      [requireResolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      ...(format !== BUILD_FORMATS.IIFE
        ? [
            [
              requireResolve('@babel/plugin-transform-runtime'),
              {
                corejs: 3,
              },
            ],
          ]
        : []),
    ],
    exclude: [/node_modules/],
  });
  return {
    input,
    output,
    // /@babel\/runtime-corejs3/ 加入 external 很重要，需要仔细阅读：
    // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
    external: format === BUILD_FORMATS.IIFE ? [] : [/@babel\/runtime-corejs3/],
    plugins: [
      json({
        namedExports: false,
      }),
      commonjs(),
      nodeResolve({
        extensions,
      }),
      babelPlugin,
      // 2022.06.25 官方已合并代码，但是还未发版
      // - feat: support emitDeclarationOnly #366: https://github.com/ezolenko/rollup-plugin-typescript2/pull/366
      // tsPlugin,
      ...plugins,
    ],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
  };
}

export function formatCreateRollupConfigOptions(options: CreateRollupConfigOptions) {
  const {
    input,
    format,
    sourcemap,
    external: rawExternal,
    plugins: rawPlugins,
    
    target,
    define: rawDefine,
    useTerser: rawUseTerser,
    browserslist: rawBrowserslist,
  } = options;
  if (!input) throw new Error('input 不能为空');
  if (!fs.pathExistsSync(input)) throw new Error('input 路径不存在');

  const defaultBrowserslistMap = getDefaultBrowserslistMap();
  let browserslist: CreateRollupConfigOptions['browserslist'] = [];
  if (rawBrowserslist) {
    browserslist = rawBrowserslist;
  } else if (target === 'node') {
    browserslist.push(...defaultBrowserslistMap.node);
  } else if (target === 'browser') {
    browserslist.push(...defaultBrowserslistMap.browser);
  } else {
    browserslist.push(...defaultBrowserslistMap.browser.concat(defaultBrowserslistMap.node));
  }
  const external = rawExternal ?? [];
  const plugins = rawPlugins ?? [];
  const define = rawDefine ?? {};
  const useTerser = rawUseTerser ?? false;
  if (useTerser) {
    plugins.push(...[
      terser({
        ecma: 5,
        module: /^esm/.test(format),
        compress: {
          pure_getters: true,
        },
        safari10: true,
      }),
    ]);
  }
  plugins.unshift(...[
    replace({
      values: define,
      preventAssignment: true,
    })
  ]);
  return {
    input,
    format,
    sourcemap,
    external,
    plugins,
    target,
    useTerser,
    browserslist,
  };
}

function getDefaultBrowserslistMap() {
  return {
    node: ['node >= 12.0'],
    browser: ['defaults', 'Chrome >= 75', 'Safari >= 10'],
  };
}