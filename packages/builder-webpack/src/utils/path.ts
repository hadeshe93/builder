import { resolve as pathResolve, join as pathJoin } from 'path';
import fs from 'fs-extra';
import { getResolve } from '@hadeshe93/lib-node';
import { generateStringTpl } from './template';
import type { ParamsGetWebpackChainConfigs, CustomedWebpackConfigs } from '../typings/configs';
import {
  PAGE_NAME_PLACEHOLDER,
  AUTO_NAME_PLACEHOLDER,
  SUPPORTED_ENTRY_EXTENSIONS,
  BACKUP_ENTRY_RELATIVE_PATH,
  PUBLIC_TEMPLATE_RELATIVE_PATH,
  PAGE_ENTRY_RELATIVE_PATH,
  PAGE_TEMPLATE_RELATIVE_PATH,
  OUTPUT_RELATIVE_PATH,
  DLL_PUBLIC_RELATIVE_PATH,
  DLL_OUTPUT_RELATIVE_PATH,
  DLL_OUTPUT_MANIFEST_NAME,
} from '../constants/index';


export type OptionsForGetPath = {
  resolve: (...args: string[]) => string;
  pageName?: string;
};

const pageNameTpl = generateStringTpl(PAGE_NAME_PLACEHOLDER);

/**
 * 获取构建入口
 *
 * @export
 * @param {OptionsForGetPath} options
 * @returns 构建入口路径
 */
export function getAppEntry(options: OptionsForGetPath) {
  // 获取构建入口支持的后缀名列表
  const getSupportedAppEntryExtList = () => SUPPORTED_ENTRY_EXTENSIONS;

  // 获取不带后缀名的构建入口路径名称
  const getAppEntryNameWithoutExt = (options: OptionsForGetPath) =>
    options.resolve(
      options.pageName ? pageNameTpl(PAGE_ENTRY_RELATIVE_PATH, options.pageName) : BACKUP_ENTRY_RELATIVE_PATH,
    );

  // 获取入口路径
  const appEntryWithoutExt = getAppEntryNameWithoutExt(options);
  const appEntryExt = getSupportedAppEntryExtList().find((ext) => fs.pathExistsSync(`${appEntryWithoutExt}${ext}`));
  return `${appEntryWithoutExt}${appEntryExt}`;
}

/**
 * 获取构建产物路径
 *
 * @export
 * @param {OptionsForGetPath} options
 * @returns 构建产物路径
 */
export function getOutputPath(options: OptionsForGetPath) {
  return options.resolve(pageNameTpl(OUTPUT_RELATIVE_PATH, options.pageName));
}

/**
 * 获取模板路径
 *
 * @export
 * @param {OptionsForGetPath} options
 * @returns 模板路径
 */
export function getTemplatePath(options: Required<OptionsForGetPath>) {
  const publicTemplatePath = options.resolve(PUBLIC_TEMPLATE_RELATIVE_PATH);
  const pageTemplatePath = options.resolve(pageNameTpl(PAGE_TEMPLATE_RELATIVE_PATH, options.pageName));
  const templatePath = fs.pathExistsSync(pageTemplatePath) ? pageTemplatePath : publicTemplatePath;
  if (templatePath !== pageTemplatePath && !fs.pathExistsSync(templatePath)) {
    return '';
  }
  return templatePath;
}

/**
 * 获取 dll 构建产物路径
 *
 * @export
 * @param {OptionsForGetPath} options 配置参数
 * @returns dll 构建产物的输出目录
 */
export function getProdDllOutputPath(options: OptionsForGetPath) {
  return options.resolve(DLL_OUTPUT_RELATIVE_PATH);
}

/**
 * 获取 dll 构建产物路径
 *
 * @export
 * @param {OptionsForGetPath} options 配置参数
 * @returns dll 构建产物的输出目录
 */
export function getProdDllPublicPath(publicPath: string = '/') {
  if (publicPath === '/') return DLL_PUBLIC_RELATIVE_PATH;
  return pathJoin(publicPath, DLL_PUBLIC_RELATIVE_PATH);
}

/**
 * 获取 dll 构建产物 manifest.json 的路径
 *
 * @export
 * @param {OptionsForGetPath} options
 * @returns dll 构建产物 manifest.json 的路径
 */
export function getProdDllManifestOutputPath(options: OptionsForGetPath) {
  return options.resolve(getProdDllOutputPath(options), DLL_OUTPUT_MANIFEST_NAME);
}

type DllPathMap = Map<
  string,
  {
    manifestJsonPath: string;
    bundleJsPath: string;
  }
>;
/**
 * 获取 dll 文件名与路径的映射 map
 *
 * @export
 * @param {ParamsGetWebpackChainConfigs} options 配置参数
 * @returns dll 文件名与路径的映射 map
 */
export function getDllPathMap(options: Partial<ParamsGetWebpackChainConfigs>): DllPathMap {
  const { dllEntryMap, projectPath } = options;
  const resolve = getResolve(projectPath);
  const OUTPUT_PATH = getProdDllOutputPath({ resolve });
  const keys = Object.keys(dllEntryMap || {});
  const map = new Map();
  const autoNameTpl = generateStringTpl(AUTO_NAME_PLACEHOLDER);

  for (const key of keys) {
    const manifestJsonPath = autoNameTpl(getProdDllManifestOutputPath({ resolve }), key);
    const manifestJson = require(manifestJsonPath);
    map.set(key, {
      manifestJsonPath,
      bundleJsPath: pathResolve(OUTPUT_PATH, `${manifestJson.name}.js`),
    });
  }
  return map;
}

export abstract class WebpackConfiguration {
  public abstract getDevConfig(): Promise<CustomedWebpackConfigs>;
  public abstract getProdConfig(): Promise<CustomedWebpackConfigs>;
  public abstract getProdDllConfig(): Promise<CustomedWebpackConfigs>;
}
