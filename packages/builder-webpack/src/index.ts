import { AbstractBuilder, BuilderConfig } from '@hadeshe93/builder-core';
import { doDev, doBuild } from './helpers/do';
import { getWebpackConfigGetters, defineProjectConfig } from './helpers/configs';
import { getCommonChainConfig } from './wpconfig/common.config';
import { getDevChainConfig } from './wpconfig/dev.config';
import { getProdChainConfig } from './wpconfig/prod.config';
import { getProdDllChainConfig } from './wpconfig/prod.dll.config';

import {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
} from './typings/index';

export default class WebpackBuilder implements AbstractBuilder {
  constructor() {}

  /**
   * 开始构建
   *
   * @param {BuilderConfig} buildConfig
   * @memberof BuilderWebpack
   */
  public async start(buildConfig: BuilderConfig) {
    const { mode, builderName } = buildConfig;
    if (builderName !== 'webpack') return;

    const webpackConfigGetters = await getWebpackConfigGetters(buildConfig);
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
  getCommonChainConfig,
  getDevChainConfig,
  getProdChainConfig,
  getProdDllChainConfig,
};

export type {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
}