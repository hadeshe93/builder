import { formatBuilderConfig, AbstractBuilder } from '@hadeshe93/builder-core';
import { doDev, doBuild } from './helpers/do';
import { getCommonChainConfig } from './wpconfig/common.config';
import { getDevChainConfig } from './wpconfig/dev.config';
import { getProdChainConfig } from './wpconfig/prod.config';
import { getProdDllChainConfig } from './wpconfig/prod.dll.config';
import { getWebpackConfigGetters, defineBuilderConfig, defineProjectConfig } from './helpers/configs';

import {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
  BuilderConfig,
  PureBuilderConfig,
  GetProjectConfig,
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
    const pureBuilderConfig = await formatBuilderConfig<BuilderConfig, PureBuilderConfig>(buildConfig);
    const { mode, builderName } = pureBuilderConfig;
    if (builderName !== 'webpack') return;

    const webpackConfigGetters = await getWebpackConfigGetters(pureBuilderConfig);
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
  defineBuilderConfig,
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
  BuilderConfig,
  GetProjectConfig,
}