import path from 'path';
import { debug } from './utils/debug';
import { doDev, doBuild } from './helpers/do';
import type { BuilderConfig } from '@hadeshe93/builder-core';
import { getConfigGetters, defineProjectConfig } from './helpers/configs';
import {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
} from './typings/index';

export default class ViteBuilder {
  constructor() {}

  // 资源文件夹路径
  assetsPath = path.resolve(__dirname, '../assets');

  async start(builderConfig: BuilderConfig) {
    const { mode, builderName } = builderConfig;
    if (builderName !== 'vite') {
      debug('builderName is not "vite", quit normally.');
      return;
    }
    const configGetters = getConfigGetters({
      builderConfig,
      envConfig: {
        assetsPath: this.assetsPath,
      },
    });
    const taskDescriptorMap = {
      development: async () => {
        await doDev(configGetters, 'serial');
      },
      production: async () => {
        await doBuild(configGetters, 'serial');
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