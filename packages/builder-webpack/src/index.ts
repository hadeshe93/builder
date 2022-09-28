import { BuilderConfig } from '@hadeshe93/builder-core';
import { doDev, doBuild } from './helpers/do';
import { getWebpackConfigs } from './helpers/configs';

export class BuilderWebpack {
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

    const webpackConfigs = getWebpackConfigs(buildConfig);
    if (mode === 'development') {
      await doDev(webpackConfigs, 'serial');
      return;
    }
    if (mode === 'production') {
      await doBuild(webpackConfigs, 'serial');
      return;
    }
  }
}

