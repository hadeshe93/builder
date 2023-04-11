import { debug } from './utils/debug';
import { doDev, doBuild } from './helpers/do';
import { formatBuilderConfig, AbstractBuilder } from '@hadeshe93/builder-core';
import { getConfigGetters, defineProjectConfig, defineBuilderConfig } from './helpers/configs';
import {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
  BuilderConfig,
  PureBuilderConfig,
  GetProjectConfig,
} from './typings/index';

export default class ViteBuilder implements AbstractBuilder {
  constructor() {}

  async start(rawBuilderConfig: BuilderConfig) {
    const builderConfig = await formatBuilderConfig<BuilderConfig, PureBuilderConfig>(rawBuilderConfig);
    const { mode, builderName } = builderConfig;
    if (builderName !== 'vite') {
      debug('builderName is not "vite", quit normally.');
      return;
    }
    const configGetters = await getConfigGetters({
      builderConfig,
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
  defineBuilderConfig,
};

export type {
  ProjectMiddleware,
  ProjectMiddlewares,
  ProjectConfig,
  BuilderConfig,
  GetProjectConfig,
}