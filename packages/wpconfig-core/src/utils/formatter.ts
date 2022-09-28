import type { ParamsGetWebpackChainConfigs } from '../typings/configs';
import { DEV_SERVER_FE_PORT } from '../constants/index';

export function formatParamsGetChainConfig(params: ParamsGetWebpackChainConfigs) {
  const {
    projectPath = process.cwd(),
    pageName = '',
    publicPath = '/',
    fePort = DEV_SERVER_FE_PORT,
    dllEntryMap,
  } = params || {};
  const lastParams: ParamsGetWebpackChainConfigs = {
    projectPath,
    pageName,
    publicPath,
    fePort,
    dllEntryMap: false,
  };
  if (Object.keys(dllEntryMap || {}).length > 0) {
    lastParams.dllEntryMap = dllEntryMap;
  } else {
    delete lastParams.dllEntryMap;
  }
  return lastParams;
}