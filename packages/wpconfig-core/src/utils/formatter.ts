import type { ParamsGetWebpackChainConfigs } from '../typings/configs';
import { DEV_SERVER_FE_PORT } from '../constants/index';

export function formatParamsGetChainConfig(params: ParamsGetWebpackChainConfigs) {
  const {
    projectPath = process.cwd(),
    pageName = '',
    publicPath: rawPublicPath = 'auto',
    fePort = DEV_SERVER_FE_PORT,
    dllEntryMap,
  } = params || {};
  const NO_TRALING_PUBLIC_PATH_LIST = ['', 'auto'];
  const publicPath = (NO_TRALING_PUBLIC_PATH_LIST.includes(rawPublicPath) || /\/$/.test(rawPublicPath))
    ? rawPublicPath
    : `${rawPublicPath}/`;
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