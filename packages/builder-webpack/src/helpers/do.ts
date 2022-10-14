import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { excuteTasks } from '@hadeshe93/builder-core';

/**
 * 启动 webpack 调试
 *
 * @export
 * @param {Configuration[]} configs
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
export async function doDev(configs: Configuration[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleDev = (config: Configuration) => {
    const compiler = webpack(config);
    const devServerOptions = { ...config.devServer, open: false };
    const server = new WebpackDevServer(devServerOptions, compiler);
    server.start();
  };
  return await excuteTasks(
    configs.map((config) => () => doSingleDev(config)),
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
export async function doBuild(configs: Configuration[], order: 'serial' | 'parallel' = 'serial') {
  const doSingleBuild = (config: Configuration) =>
    new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) {
          console.error(err.stack || err);
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          const errors = stats.toJson().errors;
          console.error(errors);
          reject(errors);
          return;
        }
        console.log(
          stats.toString({
            colors: true,
          }),
        );
        resolve(stats);
      });
    });

  return await excuteTasks(
    configs.map((config) => () => doSingleBuild(config)),
    order,
  );
}
