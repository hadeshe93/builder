import WebpackChainConfig from 'webpack-chain';
import { getCommonChainConfig } from './common.config';
import { formatParamsGetChainConfig } from '../utils/formatter';

import type { ParamsGetWebpackChainConfigs } from '../typings/configs';

export function getDevChainConfig(oriParams: ParamsGetWebpackChainConfigs, chainConfig = new WebpackChainConfig()) {
  const params = formatParamsGetChainConfig(oriParams);
  chainConfig = getCommonChainConfig(params, chainConfig);
  chainConfig.devServer
    .hot(true)
    .port(params?.devPort || 3000)
    .allowedHosts.add('all').end();
  chainConfig.devtool('inline-source-map');
  return chainConfig;
}