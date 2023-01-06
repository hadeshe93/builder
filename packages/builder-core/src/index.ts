import { excuteTasks } from './helpers/task';
import { logger, Logger } from './utils/logger';
import { formatBuilderConfig, formatAppProjectConfig, formatProjectConfig, defineProjectConfig } from './helpers/config';

import {
  BuildOrderType,
  BuilderConfig,
  ProjectConfig,
  AppProjectConfig,
  ProjectMiddleware,
  ProjectMiddlewares,
  SupportedBuilderInsMap,
  SupportedBuilderNames,
  SupportedBuilderMode,
} from './typings/index';

interface BuilderCoreOptions {
  logger: Logger;
}

export { excuteTasks, formatBuilderConfig, formatAppProjectConfig, formatProjectConfig, defineProjectConfig };
export { composeMiddlewares } from './helpers/middleware';

export type {
  BuilderConfig,
  ProjectConfig,
  AppProjectConfig,
  ProjectMiddleware,
  ProjectMiddlewares,
  SupportedBuilderNames,
  SupportedBuilderMode,
  BuilderCoreOptions,
};

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
