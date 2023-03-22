import WebpackChain from 'webpack-chain';
import { getProdDllChainConfig } from '../wpconfig/prod.dll.config'; 
import { PureBuilderConfig } from '../typings/index';
import { ParamsGetWebpackChainConfigs } from '../typings/configs';

export default function getCommonConfigMw(buildConfig: PureBuilderConfig) {
  const { mode, projectPath, pageName, projectConfig } = buildConfig;
  const { build } = projectConfig;
  const params: ParamsGetWebpackChainConfigs = {
    mode: mode as ParamsGetWebpackChainConfigs['mode'],
    projectPath,
    pageName,
    publicPath: build.publicPath,
    devPort: build.devPort,
  };
  if (build.dllEntryMap) params.dllEntryMap = build.dllEntryMap;
  return function(chainConfig: WebpackChain): WebpackChain {
    if (mode === 'production' && build.dllEntryMap) {
      chainConfig = getProdDllChainConfig(params, chainConfig);
    }
    return chainConfig;
  }
}