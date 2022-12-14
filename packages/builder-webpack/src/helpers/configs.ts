import { Configuration } from 'webpack';
import { BuilderConfig, composeMiddlewares } from '@hadeshe93/builder-core';
import { getDevChainConfig, getProdChainConfig, getProdDllChainConfig, ParamsGetWebpackChainConfigs } from '@hadeshe93/wpconfig-core';

import builderConfigAdpoterMiddleware from '../mws/builder-config-adopter';
import { ProjectConfig } from '../typings/index';
/**
 * 获取 webpack 的构建配置列表
 *
 * @export
 * @param {BuilderConfig} buildConfig
 * @returns {*}  {Configuration[]}
 */
export function getWebpackConfigGetters(buildConfig: BuilderConfig): (() => Configuration)[] {
  const { mode, builderName, appProjectConfig } = buildConfig;
  if (builderName !== 'webpack') return [];

  const { build, projectPath, pageName, middlewares } = appProjectConfig;
  const defaultMiddlewares = [
    [builderConfigAdpoterMiddleware, buildConfig],
  ];

  const middlewaresList = [];
  if (mode === 'development') {
    // 只且只有一项构建任务
    middlewaresList.push(
      [
        [() => getDevChainConfig],
        ...middlewares,
        ...defaultMiddlewares,
      ]
    );
  } else if (mode === 'production') {
    middlewaresList.push(
      [
        [() => getProdChainConfig],
        ...middlewares,
        ...defaultMiddlewares,
      ]
    );
    // 如果有配置 dllEntryMap，那需要前置一项任务
    if (build.dllEntryMap) {
      middlewaresList.unshift([
        [() => getProdDllChainConfig],
      ]);
    }
  }

  const params: ParamsGetWebpackChainConfigs = {
    mode,
    projectPath,
    pageName,
    publicPath: build.publicPath,
    fePort: build.fePort,
  };
  if (build.dllEntryMap) params.dllEntryMap = build.dllEntryMap;
  const composedFns = middlewaresList.map((middlewares) => composeMiddlewares(middlewares));
  // return composedFns.map((composedFn) => () => composedFn(params).toConfig());
  return composedFns.map((composedFn) => {
    return () => {
      const c = composedFn(params);
      const config =  c.toConfig();
      return config;
    };
  });
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