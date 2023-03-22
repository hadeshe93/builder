import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions } from 'esbuild';
import { BundledStringResult } from '../../typings/index';
import { createEsbuildPluginReplaceMeta } from './plugins/replace-meta';
import { createEsbuildExternalizeDepsPlugin } from './plugins/externalize-deps';

export {
  createEsbuildPluginReplaceMeta,
  createEsbuildExternalizeDepsPlugin,
};

export interface CreateEsbuildConfigOptions extends BuildOptions {
  // 原生配置
  entryPoints: BuildOptions['entryPoints'];
  format?: BuildOptions['format'];
  sourcemap?: BuildOptions['sourcemap'];
  external?: BuildOptions['external'];
  plugins?: BuildOptions['plugins'];
  platform: BuildOptions['platform'];
  define?: BuildOptions['define'];
  minifiy?: BuildOptions['minify'];
  target?: BuildOptions['target'];
}

export type EsbuildDynamicImportOptions = Omit<Partial<CreateEsbuildConfigOptions>, 'entryPoints' | 'platform'>;

export async function esbuildDynamicImport(filePath: string, options?: EsbuildDynamicImportOptions): Promise<any> {
  const isExisted = await fs.exists(filePath);
  if (!isExisted) {
    throw new Error(`[esbuildDynamicImport] exception: ${filePath} doest not exist`);
  }
  const esbuildConfig = createEsbuildConfig({
    entryPoints: [filePath],
    format: 'cjs',
    sourcemap: 'inline',
    platform: 'node',
    plugins: [
      createEsbuildPluginReplaceMeta(),
      createEsbuildExternalizeDepsPlugin(),
    ],
    ...(options || {}),
  });
  const originalResult = await build({
    bundle: true,
    write: false,
    ...esbuildConfig,
  });
  const content = originalResult.outputFiles?.[0]?.text || '';
  if (!content) return undefined;

  // 写硬盘文件的方式有一定的性能损耗，后面可以优化成读写内存，而且不影响项目
  // 但是这样会带来新的问题，那就是：
  // 1. require 和 import 要同时去实现加载导入字符串 —— 还好
  // 2. 如果字符串中有包依赖，那还得切换 process.cwd —— 分配到进程中去做？
  const filePathObject = path.parse(filePath);
  const tempFilePath = path.format({
    root: filePathObject.root,
    dir: filePathObject.dir,
    name: `.${filePathObject.name}.temp.${new Date().getTime()}`,
    ext: '.js',
  });
  await fs.writeFile(tempFilePath, content, 'utf8');
  const dynamicImport = esbuildConfig.format === 'esm'
    ? new Function('filePath',  'return import(filePath)')
    : require;
  const result = await dynamicImport(tempFilePath);
  await fs.unlink(tempFilePath);
  return Object.prototype.hasOwnProperty.call(result, 'default') ? result.default : result;
}

/**
 * 生成打包后的字符串
 * - 适用于打包构建简单的模板脚本代码
 *
 * @export
 * @param {CreateEsbuildConfigOptions} options
 * @returns {*}  {Promise<string>}
 */
export async function esbuildBundleString(options: CreateEsbuildConfigOptions): Promise<BundledStringResult> {
  const esbuildConfig = createEsbuildConfig({
    format: 'iife',
    sourcemap: false,
    ...options,
  });
  const originalResult = await build({
    bundle: true,
    write: false,
    ...esbuildConfig,
  });
  const string = originalResult.outputFiles?.[0]?.text || '';
  return {
    string,
    originalResult,
  };
}

/**
 * 创建 esbuild 配置
 *
 * @export
 * @param {CreateEsbuildConfigOptions} rawOptions
 * @returns {*}  {BuildOptions}
 */
export function createEsbuildConfig(rawOptions: CreateEsbuildConfigOptions): BuildOptions {
  const defaultBrowserslistMap = getDefaultBrowserslistMap();
  const target = defaultBrowserslistMap[rawOptions.platform] || [].concat(Object.values(defaultBrowserslistMap));
  return {
    target,
    ...rawOptions,
  };
}

/**
 * 获取默认的兼容性配置列表
 * - esbuild 一般在开发环境去使用，所以默认是高版本环境
 *
 * @returns {*} 
 */
function getDefaultBrowserslistMap() {
  return {
    node: ['node14'],
    browser: ['es2016'],
  };
}
