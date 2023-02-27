import ViteChain from '@hadeshe93/vite-chain';
import { composeMiddlewares } from '@hadeshe93/builder-core';
import commonConfigAdpoterMiddleware from '../mws/common-config-mw';
import builderConfigAdpoterMiddleware from '../mws/builder-config-mw';
import { ProjectConfig, GetConfigGettersOptions } from '../typings/index';



export function getConfigGetters(options: GetConfigGettersOptions) {
  const { builderConfig } = options;
  const { builderName, appProjectConfig } = builderConfig;
  if (builderName !== 'vite') return [];

  const { middlewares } = appProjectConfig;
  const defaultMiddlewares = [
    [commonConfigAdpoterMiddleware, options],
    [builderConfigAdpoterMiddleware, options],
  ];

  const middlewaresList = [];
  middlewaresList.push([
    ...defaultMiddlewares,
    ...middlewares,
  ])
  const composedFns = middlewaresList.map((middlewares) => composeMiddlewares(middlewares));
  return composedFns.map((composedFn) => {
    return () => {
      const c = composedFn(new ViteChain());
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