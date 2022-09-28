import { excuteTasks } from './helpers/task';
import { formatBuilderConfig } from './helpers/config';
import { logger, Logger } from './utils/logger';
import {
  BuildOrderType,
  BuilderConfig,
  AppProjectConfig,
  AppProjectMiddlewares,
  SupportedBuilderInsMap,
  SupportedBuilderNames,
} from './typings/index';

interface BuilderCoreOptions {
  logger: Logger;
}

export { excuteTasks };
export { compose } from './helpers/compose';

export type {
  BuilderConfig,
  AppProjectConfig,
  AppProjectMiddlewares,
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
    return async function start(order: BuildOrderType = 'serial'): Promise<any> {
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
  }
}
