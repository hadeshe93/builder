import { SSROptions } from 'vite';
import ChainedMap from './chained-map';
import { chainableToConfig } from '../utils/object';

export default class SSR extends ChainedMap {
  external: (value: SSROptions['external']) => this;
  noExternal: (value: SSROptions['noExternal']) => this;
  target: (value: SSROptions['target']) => this;
  format: (value: SSROptions['format']) => this;

  constructor(parent) {
    super(parent);
    this.extend(SSR.SHORTHANDS);
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
    const omissions = Array.from(new Set(SSR.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = SSR.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

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
    const notShorthandConfigs = SSR.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    return this.clean(Object.assign(this.entries() || {}, notShorthandConfigs));
  }

  static SHORTHANDS = [
    'external',
    'noExternal',
    'target',
    'format',
  ];
  static NOT_SHORTHANDS = [];
}
