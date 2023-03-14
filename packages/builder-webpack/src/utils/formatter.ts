import type { ParamsGetWebpackChainConfigs } from '../typings/configs';
import { DEV_SERVER_FE_PORT } from '../constants/index';
import { getEnvMode } from './mode';

export function formatParamsGetChainConfig(params: ParamsGetWebpackChainConfigs) {
  const {
    projectPath = process.cwd(),
    pageName = '',
    publicPath: rawPublicPath = 'auto',
    devPort = DEV_SERVER_FE_PORT,
    dllEntryMap,
  } = params || {};
  const mode = getEnvMode(params.mode);
  const NO_TRALING_PUBLIC_PATH_LIST = ['', 'auto'];
  const publicPath = (NO_TRALING_PUBLIC_PATH_LIST.includes(rawPublicPath) || /\/$/.test(rawPublicPath))
    ? rawPublicPath
    : `${rawPublicPath}/`;
  const lastParams: ParamsGetWebpackChainConfigs = {
    mode,
    projectPath,
    pageName,
    publicPath,
    devPort,
    dllEntryMap: false,
  };
  if (Object.keys(dllEntryMap || {}).length > 0) {
    lastParams.dllEntryMap = dllEntryMap;
  } else {
    delete lastParams.dllEntryMap;
  }
  return lastParams;
}