import { UserConfig, ServerOptions } from 'vite';
import ChainedMap from './chained-map';
import ChainedSet from './chained-set';
import { chainableToConfig } from '../utils/object';
import type { EndableServerFs, EndableChainedSet,  } from '../types/index';

export default class Server extends ChainedMap {
  host: (value: UserConfig['server']['host']) => this;
  port: (value: UserConfig['server']['port']) => this;
  strictPort: (value: UserConfig['server']['strictPort']) => this;
  https: (value: UserConfig['server']['https']) => this;
  open: (value: UserConfig['server']['open']) => this;
  proxy: (value: UserConfig['server']['proxy']) => this;
  cors: (value: UserConfig['server']['cors']) => this;
  headers: (value: UserConfig['server']['headers']) => this;
  hmr: (value: UserConfig['server']['hmr']) => this;
  watch: (value: UserConfig['server']['watch']) => this;
  middlewareMode: (value: UserConfig['server']['middlewareMode']) => this;
  base: (value: UserConfig['server']['base']) => this;
  origin: (value: UserConfig['server']['origin']) => this;

  fs: EndableServerFs<typeof this> = new Fs(this);

  constructor(parent) {
    super(parent);
    this.extend(Server.SHORTHANDS);
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
    const omissions = Array.from(new Set(Server.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = Server.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

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
    const notShorthandConfigs = Server.NOT_SHORTHANDS.reduce((acc, key) => {
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
    'hmr',
    'watch',
    'middlewareMode',
    'base',
    'origin',
  ];
  static NOT_SHORTHANDS = ['fs'];
}

/**
 * Server.Fs 类
 *
 * @class Fs
 * @extends {ChainedMap}
 */
export class Fs extends ChainedMap {
  strict: (value: ServerOptions['fs']['strict']) => this;
  allow: (value: ServerOptions['fs']['allow']) => this;
  deny: EndableChainedSet<Fs> = new ChainedSet(this);

  constructor(parent) {
    super(parent);
    this.extend(Fs.SHORTHANDS);
  }

  /**
   * 转成 json
   *
   * @returns {*}
   * @memberof Fs
   */
  toConfig() {
    const notShorthandConfigs = Fs.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    return this.clean(Object.assign(this.entries() || {}, notShorthandConfigs));
  }

  static SHORTHANDS = ['strict', 'allow'];
  static NOT_SHORTHANDS = ['deny'];
}