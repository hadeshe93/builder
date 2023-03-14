import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { excuteTasks } from '@hadeshe93/builder-core';
import { debug } from '../utils/debug';

/**
 * 启动 webpack 调试
 *
 * @export
 * @param {Configuration[]} configs
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
export async function doDev(configGetters: (() => Promise<Configuration>)[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleDev = (config: Configuration) => {
    const compiler = webpack(config);
    const devServerOptions = { ...config.devServer, open: false };
    const server = new WebpackDevServer(devServerOptions, compiler);
    // start 方法会返回一个 promise
    return server.start();
  };
  return await excuteTasks(
    configGetters.map((configGetter) => async () => doSingleDev(await configGetter())),
    order,
  );
}

/**
 * 启动构建
 *
 * @export
 * @param {Configuration[]} configs
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
export async function doBuild(configGetters: (() => Promise<Configuration>)[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleBuild = (config: Configuration) =>
    new Promise((resolve, reject) => {
      debug('%O', config);
      webpack(config, (err, stats) => {
        if (err) {
          console.error(err.stack || err);
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          const errors = stats.toJson().errors;
          console.error(JSON.stringify(errors, null, 2));
          reject(errors);
          return;
        }
        console.log(
          stats.toString({
            // 表示其他缺省项的默认值
            all: true,
            colors: true,
          }),
          // stats.toString('normal'),
        );
        resolve(stats);
      });
    });

  return await excuteTasks(
    configGetters.map((configGetter) => async () => {
      const configs = await configGetter();
      return doSingleBuild(configs);
    }),
    order,
  );
}
