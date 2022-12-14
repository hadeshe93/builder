import type { BuilderConfig } from '@hadeshe93/builder-core';
import { doDev, doBuild } from './helpers/do';
import { getWebpackConfigGetters, defineProjectConfig } from './helpers/configs';

import {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
} from './typings/index';

export default class BuilderWebpack {
  constructor() {
  }

  /**
   * 开始构建
   *
   * @param {BuilderConfig} buildConfig
   * @memberof BuilderWebpack
   */
  public async start(buildConfig: BuilderConfig) {
    const { mode, builderName } = buildConfig;
    if (builderName !== 'webpack') return;

    const webpackConfigGetters = getWebpackConfigGetters(buildConfig);
    const taskDescriptorMap = {
      development: async () => {
        await doDev(webpackConfigGetters, 'serial');
      },
      production: async () => {
        await doBuild(webpackConfigGetters, 'serial');
      },
    };
    const excuteTask = taskDescriptorMap[mode];
    if (excuteTask) {
      await excuteTask();
    }
  }
}

export {
  defineProjectConfig,
};

export type {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
}