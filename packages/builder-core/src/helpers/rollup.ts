import path from 'path';
import { rollup, RollupOptions, OutputOptions } from 'rollup';
import fs from 'fs-extra';
// import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import { getNodeModulePaths, getRequireResolve } from '@hadeshe93/lib-node';
import { BundledStringResult } from '../typings/index';

export interface CreateRollupConfigOptions {
  // rollup 配置
  input: string;
  format?: OutputOptions['format'];
  sourcemap?: OutputOptions['sourcemap'];
  external?: RollupOptions['external'];
  plugins?: RollupOptions['plugins'];

  // 自定义配置
  target: 'node' | 'browser' | 'common';
  define?: Record<string, any>;
  minify?: boolean;
  browserslist?: string | string[] | Record<string, string | string[]>;
}

export type RollupConfig = RollupOptions & { output: OutputOptions };
// 目标构建类型
export const BUILD_FORMATS = {
  CJS: 'cjs',
  ESM: 'esm',
  IIFE: 'iife',
};

/**
 * 生成打包后的字符串
 *
 * @export
 * @param {CreateRollupConfigOptions} options
 * @returns {*}  {Promise<string>}
 */
export async function rollupBundleString(options: CreateRollupConfigOptions): Promise<BundledStringResult> {
  const rollupConfig = createRollupConfig({
    format: 'iife',
    sourcemap: false,
    ...options,
  });
  const { output: outputConfig, ...inputConfig } = rollupConfig;
  const bundle = await rollup(inputConfig as RollupOptions);
  const originalResult = await bundle.generate(outputConfig as OutputOptions);
  const string = originalResult?.output?.[0]?.code || '';
  return {
    string,
    originalResult,
  };
}

/**
 * 创建 rollup 配置
 *
 * @export
 * @param {CreateRollupConfigOptions} options
 * @returns {*}  {RollupConfig}
 */
export function createRollupConfig(options: CreateRollupConfigOptions): RollupConfig {
  const nodeModulePaths = getNodeModulePaths([path.resolve('./')]);
  const requireResolve = getRequireResolve(nodeModulePaths);
  const { input, format, sourcemap, browserslist, plugins } = formatCreateRollupConfigOptions(options);
  const output = {
    format,
    sourcemap,
    exports: 'auto',
  } as const;
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
    onwarn: (warning, warnCallback) => {
      if (!/Circular/.test(warning.message)) {
        warnCallback(warning);
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
  };
}

/**
 * 格式化入参
 *
 * @param {CreateRollupConfigOptions} options
 * @returns {*} 
 */
function formatCreateRollupConfigOptions(options: CreateRollupConfigOptions) {
  const {
    input,
    format,
    sourcemap,
    external: rawExternal,
    plugins: rawPlugins,

    target,
    define: rawDefine,
    minify: rawMinify,
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
  const minify = rawMinify ?? false;
  if (minify) {
    plugins.push(
      ...[
        terser({
          ecma: 5,
          module: /^esm/.test(format),
          compress: {
            pure_getters: true,
          },
          safari10: true,
        }),
      ]
    );
  }
  plugins.unshift(
    ...[
      replace({
        values: define,
        preventAssignment: true,
      }),
    ]
  );
  return {
    input,
    format,
    sourcemap,
    external,
    plugins,
    target,
    minify,
    browserslist,
  };
}

/**
 * 获取默认的兼容性配置列表
 *
 * @returns {*} 
 */
function getDefaultBrowserslistMap() {
  return {
    node: ['node >= 12.0'],
    browser: ['defaults', 'Chrome >= 75', 'Safari >= 10'],
  };
}
