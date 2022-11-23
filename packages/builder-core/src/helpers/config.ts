import path from 'path';
import { ProjectConfig, AppProjectConfig, BuilderConfig } from '../typings/index';

/**
 * 格式化构建器相关的配置
 *
 * @export
 * @param {BuilderConfig} builderConfig
 * @returns {*} 
 */
export function formatBuilderConfig(builderConfig: BuilderConfig) {
  const { mode, builderName, appProjectConfig } = builderConfig;
  return {
    mode: mode || 'development',
    builderName: builderName || 'webpack',
    appProjectConfig: formatAppProjectConfig(appProjectConfig),
  };
}

/**
 * 格式化应用下提供的项目配置
 *
 * @export
 * @param {AppProjectConfig} appProjectConfig
 * @returns {*}  {AppProjectConfig}
 */
export function formatAppProjectConfig(appProjectConfig: AppProjectConfig): AppProjectConfig {
  const { page, build } = formatProjectConfig(appProjectConfig);
  const projectPath = appProjectConfig.projectPath || '';
  const pageName = appProjectConfig.pageName || '';
  const middlewares = (appProjectConfig.middlewares || []).map((m) => {
    const [mw] = m;
    // 支持函数
    if (typeof mw !== 'string') return typeof mw === 'function' ? m : undefined;
    // 支持绝对路径
    if (path.isAbsolute(mw)) return m;
    // 不支持相对路径
    const relativePathPrefixes = [
      path.join('.', path.sep),
      path.join('..', path.sep),
    ];
    if (!!relativePathPrefixes.find((prefix) => mw.startsWith(prefix))) return undefined;
    // 支持直接写 npm 包名
    const absPath = path.resolve(projectPath, 'node_modules', mw);
    m[0] = absPath;
    return m;
  }).filter(m => !!m);
  return {
    page,
    build,
    projectPath,
    pageName,
    middlewares,
  };
}

/**
 * 格式化核心构建配置
 *
 * @export
 * @param {AppProjectConfig} appProjectConfig
 * @returns {*}  {ProjectConfig}
 */
export function formatProjectConfig(appProjectConfig: AppProjectConfig): ProjectConfig {
  const { page: oriPage, build: oriBuild } = appProjectConfig || {};
  const page = {
    title: oriPage.title || '页面标题',
    description: oriPage.description || '页面描述',
    useFlexible: oriPage.useFlexible || false,
    useDebugger: oriPage.useDebugger || false,
  };
  if (page.useFlexible) {
    page['pxtoremOptions'] = {
      rootValue: 75,
      propList: ['*'],
      unitPrecision: 4,
      ...(oriPage.pxtoremOptions || {}),
    };
  }
  const build = {
    fePort: oriBuild.fePort || 3200,
    publicPath: oriBuild.publicPath || '',
    dllEntryMap: oriBuild.dllEntryMap || undefined,
  };
  if (!build.dllEntryMap) {
    delete build.dllEntryMap;
  }
  return {
    page,
    build,
  };
}