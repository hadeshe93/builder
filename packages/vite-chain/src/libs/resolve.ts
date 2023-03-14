import { UserConfig } from 'vite';
import ChainedMap from './chained-map';
import ChainedSet from './chained-set';
import type { EndableChainedMap, EndableChainedSet } from '../types/index';

const SHORTHANDS = ['browserField', 'preserveSymlinks'];
const NO_SHORTHANDS = ['alias', 'dedupe', 'conditions', 'mainFields', 'extensions'];

export default class Resolve extends ChainedMap {
  browserField: (value: UserConfig['resolve']['browserField']) => this;
  preserveSymlinks: (value: UserConfig['resolve']['preserveSymlinks']) => this;

  alias: EndableChainedMap<typeof this> = new ChainedMap(this);
  dedupe: EndableChainedSet<typeof this> = new ChainedSet(this);
  conditions: EndableChainedSet<typeof this> = new ChainedSet(this);
  mainFields: EndableChainedSet<typeof this> = new ChainedSet(this);
  extensions: EndableChainedSet<typeof this> = new ChainedSet(this);

  constructor(parent) {
    super(parent);
    this.extend(SHORTHANDS);
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
    const omissions = Array.from(new Set(NO_SHORTHANDS.concat(omit)));
    const notShorthandOmissions = NO_SHORTHANDS.filter(item => !omit.includes(item));

    // 复杂的属性手动进行合并
    notShorthandOmissions.forEach((key) => {
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
    const notShorthandConfigs = NO_SHORTHANDS.reduce((acc, key) => {
      const member = this[key];
      let value: any;
      if ('toConfig' in member) {
        value = member.toConfig();
      } else if (member instanceof ChainedSet) {
        value = member.values();
      } else if (member instanceof ChainedMap) {
        value = member.entries();
      } else {
        value = this.get(key);
      }
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
    return this.clean(
      Object.assign(this.entries() || {}, notShorthandConfigs)
    );
  }
}