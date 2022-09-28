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
  const middlewares = (appProjectConfig.middlewares || []).filter(m => !!m);
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
    useFlexible: false,
    useDebugger: false,
  };
  const build = {
    fePort: oriBuild.fePort || 3200,
    publicPath: oriBuild.publicPath || '/',
  };
  return {
    page,
    build,
  };
}