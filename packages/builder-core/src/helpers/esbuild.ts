import { build, BuildOptions } from 'esbuild';
import { BundledStringResult } from '../typings/index';

export interface CreateEsbuildConfigOptions {
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

/**
 * 生成打包后的字符串
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
  })
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
