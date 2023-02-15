import { PreviewOptions } from 'vite';
import ChainedMap from './chained-map';
import { chainableToConfig } from '../utils/object';

export default class Preview extends ChainedMap {
  host: (value: PreviewOptions['host']) => this;
  port: (value: PreviewOptions['port']) => this;
  strictPort: (value: PreviewOptions['strictPort']) => this;
  https: (value: PreviewOptions['https']) => this;
  open: (value: PreviewOptions['open']) => this;
  proxy: (value: PreviewOptions['proxy']) => this;
  cors: (value: PreviewOptions['cors']) => this;
  headers: (value: PreviewOptions['headers']) => this;

  constructor(parent) {
    super(parent);
    this.extend(Preview.SHORTHANDS);
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
    const omissions = Array.from(new Set(Preview.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = Preview.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

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
    const notShorthandConfigs = Preview.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    return this.clean(Object.assign(this.entries() || {}, notShorthandConfigs));
  }

  static SHORTHANDS = [
    'host',
    'port',
    'strictPort',
    'https',
    'open',
    'proxy',
    'cors',
    'headers',
  ];
  static NOT_SHORTHANDS = [];
}
