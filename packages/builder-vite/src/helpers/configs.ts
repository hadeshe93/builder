import ViteChain from '@hadeshe93/vite-chain';
import { composeMiddlewares } from '@hadeshe93/builder-core';
import getCommonConfigMw from '../mws/common-config-mw';
import getPageConfigMw from '../mws/page-config-mw';
import { ProjectConfig, GetConfigGettersOptions } from '../typings/index';

/**
 * 获取最终的构建配置
 * - 由于每项构建可能包含不止一项子任务，所以以数组的方式进行返回
 *
 * @export
 * @param {GetConfigGettersOptions} options
 * @returns {*} 
 */
export async function getConfigGetters(options: GetConfigGettersOptions) {
  const { builderConfig } = options;
  const { builderName, projectConfig } = builderConfig;
  if (builderName !== 'vite') return [];

  const { middlewares } = projectConfig;
  const defaultMiddlewares = [
    [getCommonConfigMw, options],
    [getPageConfigMw, options],
  ];

  const middlewaresList = [];
  middlewaresList.push([
    ...defaultMiddlewares,
    ...middlewares,
  ])
  const composedFns = await Promise.all(middlewaresList.map((middlewares) => composeMiddlewares(middlewares)));
  return await Promise.all(
    composedFns.map((composedFn) => {
      return async () => {
        const c = await composedFn(new ViteChain());
        const config = c.toConfig();
        return config;
      };
    })
  );
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