import { ALLOWED_MODES, ALLOWED_MODES_MAP } from '../constants/index';
import type { CustomedWebpackConfigs } from '../typings/configs';

export function getEnvMode(mode: any) {
  return (ALLOWED_MODES.find((allowedMode) => allowedMode === mode) || ALLOWED_MODES_MAP.development) as CustomedWebpackConfigs['mode']
}

/**
 * 判断是否为开发环境
 *
 * @export
 * @returns 是否为开发环境
 */
export function checkIsEnvDevMode(mode: any): boolean {
  return getEnvMode(mode) === ALLOWED_MODES_MAP.development;
}

/**
 * 判断是否为生产环境
 *
 * @export
 * @returns 是否为生产环境
 */
export function checkIsEnvProdMode(mode: any): boolean {
  return getEnvMode(mode) === ALLOWED_MODES_MAP.production;
}
