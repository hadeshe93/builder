import { createServer, build, InlineConfig } from 'vite';
import { excuteTasks } from '@hadeshe93/builder-core';
import { debug } from '../utils/debug';

/**
 * 启动调试
 *
 * @export
 * @param {Configuration[]} configs
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
export async function doDev(configGetters: (() => InlineConfig)[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleDev = async (rawConfig: InlineConfig) => {
    const config = { configFile: false, ...rawConfig } as InlineConfig;
    debug('doSingleDev config: %O', config);
    const server = await createServer(config);
    // listen 方法会返回一个 promise
    await server.listen();
    server.printUrls();
    return server;
  };
  return await excuteTasks(
    configGetters.map((configGetter) => () => doSingleDev(configGetter())),
    order,
  );
}

/**
 * 启动调试
 *
 * @export
 * @param {Configuration[]} configs
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
export async function doBuild(configGetters: (() => InlineConfig)[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleBuild = async (config: InlineConfig) => {
    debug('doSingleBuild config: %O', config);
    return build(config);
  };
  return await excuteTasks(
    configGetters.map((configGetter) => () => doSingleBuild(configGetter())),
    order,
  );
}
