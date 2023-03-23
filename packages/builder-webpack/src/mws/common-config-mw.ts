import path from 'path';
import WebpackChain from 'webpack-chain';
import { getDevChainConfig } from '../wpconfig/dev.config'; 
import { getProdChainConfig } from '../wpconfig/prod.config'; 
import { PureBuilderConfig } from '../typings/index';
import { ParamsGetWebpackChainConfigs } from '../typings/configs';

const getDefaultPublicPath = (pageName: string) => path.join(path.sep, pageName, path.sep);

export default function getCommonConfigMw(buildConfig: PureBuilderConfig) {
  const { mode, projectPath, pageName, projectConfig } = buildConfig;
  const { build } = projectConfig;
  const { publicPath: rawPublicPath = '', devPort } = build;
  const publicPath = rawPublicPath ? rawPublicPath : getDefaultPublicPath(pageName);
  const params: ParamsGetWebpackChainConfigs = {
    mode: mode as ParamsGetWebpackChainConfigs['mode'],
    projectPath,
    pageName,
    publicPath,
    devPort,
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