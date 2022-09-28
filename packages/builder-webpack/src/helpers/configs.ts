import { Configuration } from 'webpack';
import WebpackChain from 'webpack-chain';
import { BuilderConfig, compose } from '@hadeshe93/builder-core';
import { getDevChainConfig, getProdChainConfig, getProdDllChainConfig, ParamsGetWebpackChainConfigs } from '@hadeshe93/wpconfig-core';

/**
 * 获取 webpack 的构建配置列表
 *
 * @export
 * @param {BuilderConfig} buildConfig
 * @returns {*}  {Configuration[]}
 */
export function getWebpackConfigs(buildConfig: BuilderConfig): Configuration[] {
  const { mode, builderName, appProjectConfig } = buildConfig;
  if (builderName !== 'webpack') return [];

  const { build, projectPath, pageName, middlewares } = appProjectConfig;

  const middlewaresList = [];
  if (mode === 'development') {
    // 只且只有一项构建任务
    middlewaresList[0] = [
      [() => getDevChainConfig],
      ...middlewares
    ];
  } else if (mode === 'production') {
    middlewaresList[0] = [
      [() => getProdChainConfig],
      ...middlewares
    ];
    // 如果有配置 dllEntryMap，那需要前置一项任务
    if (build.dllEntryMap) {
      middlewaresList.unshift([
        [() => getProdDllChainConfig],
      ]);
    }
  }

  const params: ParamsGetWebpackChainConfigs = {
    projectPath,
    pageName,
    publicPath: build.publicPath,
    fePort: build.fePort,
  };
  const composedFns = middlewaresList.map((middlewares) => compose(middlewares));
  const webpackChains: WebpackChain[] = composedFns.map((composedFn) => composedFn(params));
  return webpackChains.map((chain) => chain.toConfig());
}