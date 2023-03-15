import path from 'path';
import { getRequireResolve, getNodeModulePaths } from '@hadeshe93/wpconfig-core';
import { ProjectConfig, BuilderConfig } from '../typings/index';

/**
 * 格式化构建器相关的配置
 *
 * @export
 * @param {BuilderConfig} builderConfig
 * @returns {*} 
 */
export function formatBuilderConfig(builderConfig: BuilderConfig) {
  const { mode, builderName, projectPath, pageName, projectConfig } = builderConfig;
  return {
    mode: mode || 'development',
    builderName: builderName || 'webpack',
    projectPath: projectPath || '',
    pageName: pageName || '',
    projectConfig: formatProjectConfig(projectConfig),
  };
}

/**
 * 格式化项目核心构建配置
 *
 * @export
 * @param {ProjectConfig} projectConfig
 * @returns {*}  {ProjectConfig}
 */
export function formatProjectConfig(projectConfig: ProjectConfig): ProjectConfig {
  const { page: oriPage, build: oriBuild, middlewares: oriMiddlewares } = projectConfig || {};
  const { useInjection: oriUseInjection, pxtoremOptions: oriPxtoremOptions } = oriPage;
  const useInjection = oriUseInjection ? {
    debugger: Boolean(oriUseInjection?.debugger),
    flexible: Boolean(oriUseInjection?.flexible),
    pageSpeedTester: Boolean(oriUseInjection?.pageSpeedTester),
  } : undefined;
  // 处理 page 配置
  const page = {
    title: oriPage.title || '页面标题',
    description: oriPage.description || '页面描述',
    useInjection,
  };
  if (useInjection?.flexible && !oriPxtoremOptions) {
    page['pxtoremOptions'] = {
      rootValue: 75,
      propList: ['*'],
      unitPrecision: 4,
      ...(oriPage.pxtoremOptions || {}),
    };
  }
  // 处理 build 配置
  const build = {
    devPort: oriBuild.devPort || 3200,
    publicPath: oriBuild.publicPath || '',
    dllEntryMap: oriBuild.dllEntryMap || undefined,
  };
  if (!build.dllEntryMap) {
    delete build.dllEntryMap;
  }
  // 处理 middlewares 配置
  const middlewares = (oriMiddlewares || []).map((m) => {
    const [mw] = m;
    // 支持函数
    if (typeof mw !== 'string') return typeof mw === 'function' ? m : undefined;
    // 支持绝对路径
    if (path.isAbsolute(mw)) return m;
    // 注意：这里不支持相对路径，因为不知道相对于哪个路径，但可以在上层调用前格式化成绝对路径传入
    const relativePathPrefixes = [
      path.join('.', path.sep),
      path.join('..', path.sep),
    ];
    if (!!relativePathPrefixes.find((prefix) => mw.startsWith(prefix))) return undefined;
    // 支持直接写 npm 包名
    const requireResolve = getRequireResolve(getNodeModulePaths());
    const absPath = requireResolve(mw);
    m[0] = absPath;
    return m;
  }).filter(m => !!m);
  return {
    page,
    build,
    middlewares,
  };
}

/**
 * 定义项目核心构建配置
 * - 核心是对外提供类型帮助
 *
 * @export
 * @param {ProjectConfig} projectConfig
 * @returns {*}  {ProjectConfig}
 */
export function defineProjectConfig(projectConfig: ProjectConfig): ProjectConfig {
  return projectConfig;
}

/**
 * 定义构建器配置
 *
 * @export
 * @param {BuilderConfig} builderConfig
 * @returns {*}  {BuilderConfig}
 */
export function defineBuilderConfig(builderConfig: BuilderConfig): BuilderConfig {
  return builderConfig;
}