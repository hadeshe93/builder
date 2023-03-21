import { Configuration } from 'webpack';
import WebpackChain from 'webpack-chain';
import { composeMiddlewares } from '@hadeshe93/builder-core';

import getPageConfigMw from '../mws/page-config-mw';
import getDllConfigMw from '../mws/dll-config-mw';
import getCommonConfigMw from '../mws/common-config-mw';
import { BuilderConfig, DefineProjectConfigFunction } from '../typings/index';

/**
 * 获取 webpack 的构建配置列表
 *
 * @export
 * @param {BuilderConfig} buildConfig
 * @returns {*}  {Configuration[]}
 */
export async function getWebpackConfigGetters(buildConfig: BuilderConfig): Promise<(() => Promise<Configuration>)[]> {
  const { mode, builderName, projectConfig } = buildConfig;
  if (builderName !== 'webpack') return [];

  const { build,  middlewares } = projectConfig;
  const defaultMiddlewares = [
    [getCommonConfigMw, buildConfig],
    [getPageConfigMw, buildConfig],
  ];

  const middlewaresList = [];
  // 第一项构建任务
  middlewaresList.push(
    [
      ...defaultMiddlewares,
      ...middlewares,
    ]
  );
  if (mode === 'production' && build.dllEntryMap) {
    // 如果有配置 dllEntryMap，那需要前置一项任务
    middlewaresList.unshift([
      [getDllConfigMw, buildConfig],
    ]);
  }

  const composedFns = await Promise.all(middlewaresList.map((middlewares) => composeMiddlewares(middlewares)));
  return composedFns.map((composedFn) => {
    return async () => {
      const c = await composedFn(new WebpackChain());
      const config =  c.toConfig();
      return config;
    };
  });
}

/**
 * 定义项目核心构建配置
 * - 目标是对外提供类型帮助
 *
 * @export
 * @param {ProjectConfig} projectConfig
 * @returns {*}  {ProjectConfig}
 */
export function defineProjectConfig(projectConfigOrFunc: DefineProjectConfigFunction): DefineProjectConfigFunction {
  return projectConfigOrFunc;
}

/**
 * 定义项目构建器配置
 * - 目标是对外提供类型帮助
 *
 * @export
 * @param {BuilderConfig} builderConfig
 * @returns {*}  {BuilderConfig}
 */
export function defineBuilderConfig(builderConfig: BuilderConfig): BuilderConfig {
  return builderConfig;
}