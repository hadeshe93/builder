import type { BuilderConfig } from '@hadeshe93/builder-core';
import { doDev, doBuild } from './helpers/do';
import { getWebpackConfigGetters } from './helpers/configs';

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
    if (mode === 'development') {
      await doDev(webpackConfigGetters, 'serial');
      return;
    }
    if (mode === 'production') {
      await doBuild(webpackConfigGetters, 'serial');
      return;
    }
  }
}

