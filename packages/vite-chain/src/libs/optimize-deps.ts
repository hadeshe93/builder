import { DepOptimizationOptions } from 'vite';
import ChainedMap from './chained-map';
import { chainableToConfig } from '../utils/object';

export default class OptimizeDeps extends ChainedMap {
  // 由于实际 DepOptimizationOptions.entries 与 ChainedMap 下的 entries 冲突了，所以得改个名字
  entryList: (value: DepOptimizationOptions['entries']) => this;
  exclude: (value: DepOptimizationOptions['exclude']) => this;
  include: (value: DepOptimizationOptions['include']) => this;
  esbuildOptions: (value: DepOptimizationOptions['esbuildOptions']) => this;
  force: (value: DepOptimizationOptions['force']) => this;

  constructor(parent) {
    super(parent);
    this.extend(OptimizeDeps.SHORTHANDS);
  }

  /**
   * 合并
   *
   * @param {Record<string, any>} obj
   * @param {*} [omit=[]]
   * @returns {*}
   * @memberof Resolve
   */
  merge(obj: Record<string, any>, omit = []) {
    const omissions = Array.from(new Set(OptimizeDeps.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = OptimizeDeps.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

    // 复杂的属性手动进行合并
    includedNotShorthandOmissions.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omissions]);
  }

  /**
   * 转成 json
   *
   * @returns {*}
   * @memberof Resolve
   */
  toConfig() {
    const notShorthandConfigs = OptimizeDeps.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    const json: any = this.entries();
    const entryList: DepOptimizationOptions['entries'] | undefined = json?.entryList;
    if (entryList) {
      delete json.entryList;
      json.entries = entryList;
    }
    return this.clean(Object.assign(json || {}, notShorthandConfigs));
  }

  static SHORTHANDS = [
    'entryList',
    'exclude',
    'include',
    'esbuildOptions',
    'force',
  ];
  static NOT_SHORTHANDS = [];
}
