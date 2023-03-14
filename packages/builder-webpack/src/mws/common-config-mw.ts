import WebpackChain from 'webpack-chain';
import { BuilderConfig } from '@hadeshe93/builder-core';
import { getDevChainConfig } from '../wpconfig/dev.config'; 
import { getProdChainConfig } from '../wpconfig/prod.config'; 
import { ParamsGetWebpackChainConfigs } from '../typings/configs';

export default function getCommonConfigMw(buildConfig: BuilderConfig) {
  const { mode, projectPath, pageName, projectConfig } = buildConfig;
  const { build } = projectConfig;
  const params: ParamsGetWebpackChainConfigs = {
    mode,
    projectPath,
    pageName,
    publicPath: build.publicPath,
    devPort: build.devPort,
  };
  if (build.dllEntryMap) params.dllEntryMap = build.dllEntryMap;
  return function(chainConfig: WebpackChain): WebpackChain {
    if (mode === 'development') {
      chainConfig = getDevChainConfig(params, chainConfig);
    } else if (mode === 'production') {
      chainConfig = getProdChainConfig(params, chainConfig);
    }
    return chainConfig;
  }
}