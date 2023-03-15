import path from 'path';
import { excuteTasks } from './helpers/task';
import { HtmlInjector } from './helpers/html-injector';
import { logger, Logger } from './utils/logger';
import { formatBuilderConfig, formatProjectConfig, defineProjectConfig, defineBuilderConfig } from './helpers/config';

import {
  BuildOrderType,
  BuilderConfig,
  ProjectConfig,
  ProjectMiddleware,
  ProjectMiddlewares,
  SupportedBuilderInsMap,
  SupportedBuilderNames,
  SupportedBuilderMode,
} from './typings/index';

interface BuilderCoreOptions {
  logger: Logger;
}

export { excuteTasks, formatBuilderConfig, formatProjectConfig, defineProjectConfig, defineBuilderConfig };
export { composeMiddlewares } from './helpers/middleware';
export { rollupBundleString } from './helpers/rollup';
export { esbuildBundleString } from './helpers/esbuild';

export type {
  BuilderConfig,
  ProjectConfig,
  ProjectMiddleware,
  ProjectMiddlewares,
  SupportedBuilderNames,
  SupportedBuilderMode,
  BuilderCoreOptions,
};

// 资源文件夹路径
const assetsPath = path.resolve(__dirname, '../assets');
// 初始化 HtmlInjector 类
HtmlInjector.init({
  partialScriptEntries: [
    path.resolve(assetsPath, 'injection-script/index.ts'),
  ],
});
export { HtmlInjector };

export abstract class AbstractBuilder {
  public abstract start(builderConfig: BuilderConfig): Promise<any>;
}

/**
 * 构建器基类
 *
 * @export
 * @class BuilderBase
 */
export default class BuilderCore {
  public builderInsMap: SupportedBuilderInsMap = new Map();
  public logger: Logger = logger;

  constructor(options: BuilderCoreOptions) {
    if (typeof options.logger === 'function') {
      this.logger = options.logger;
    }
  }

  /**
   * 注册构建器
   *
   * @param {SupportedBuilderNames} builderName 构建器名
   * @param {*} builderIns
   * @returns {*}
   * @memberof BuilderCore
   */
  public registerBuilder(builderName: SupportedBuilderNames, builderIns: any) {
    if (this.builderInsMap.has(builderName)) {
      logger.warn(`"${builderName}" has been registered.`);
      return false;
    }
    this.builderInsMap.set(builderName, builderIns);
  }

  /**
   * 创建执行器
   *
   * @param {BuilderConfig[]} oriConfigs 构建用的配置集合
   * @returns {*}
   * @memberof BuilderCore
   */
  public createExcutor(oriConfigs: BuilderConfig[]) {
    const configs = (oriConfigs || []).map(formatBuilderConfig);
    const start = async (order: BuildOrderType = 'serial'): Promise<any> => {
      const tasks = configs
        .map((configItem) => {
          const { builderName } = configItem;
          if (!this.builderInsMap.has(builderName)) {
            logger.warn(`"${builderName}" has not been registered, so the relative build will be ignored.`);
            return null;
          }
          return async () => {
            const builderIns = this.builderInsMap.get(builderName);
            return await builderIns.start(configItem);
          };
        })
        .filter((task) => !!task);
      return await excuteTasks(tasks, order);
    };
    return start;
  }
}
