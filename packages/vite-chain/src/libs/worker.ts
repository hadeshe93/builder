import { UserConfig } from 'vite';
import ChainedMap from './chained-map';
import Plugin from './plugin';
import { chainableToConfig } from '../utils/object';

type WorkerOptions = UserConfig['worker'];

export default class WORKER extends ChainedMap {
  format: (value: WorkerOptions['format']) => this;
  rollupOptions: (value: WorkerOptions['rollupOptions']) => this;
  plugins: ChainedMap = new ChainedMap(this);

  constructor(parent) {
    super(parent);
    this.extend(WORKER.SHORTHANDS);
  }

  plugin(name: string): InstanceType<typeof Plugin> {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
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
    const omissions = Array.from(new Set(WORKER.NOT_SHORTHANDS.concat(omit)));
    const includedNotShorthandOmissions = WORKER.NOT_SHORTHANDS.filter((item) => !omit.includes(item));

    // 复杂的属性手动进行合并
    includedNotShorthandOmissions.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this[key].merge(obj[key]);
      }
    });
    // 与 webpack-chain 的写法保持一致
    if (!omit.includes('plugin') && Object.prototype.hasOwnProperty.call(obj, 'plugin')) {
      Object.entries(obj.plugin).forEach(([name, plugin]) => {
        this.plugin(name).merge(plugin);
      });
    }

    return super.merge(obj, [...omissions]);
  }

  /**
   * 转成 json
   *
   * @returns {*}
   * @memberof Resolve
   */
  toConfig() {
    const notShorthandConfigs = WORKER.NOT_SHORTHANDS.reduce((acc, key) => {
      acc[key] = chainableToConfig(this[key]);
      return acc;
    }, {} as Record<string, any>);
    return this.clean(Object.assign(this.entries() || {}, {
      ...notShorthandConfigs,
      plugins: this.plugins.values().map((plugin: InstanceType<typeof Plugin>) => plugin.toConfig()),
    }));
  }

  static SHORTHANDS = [
    'format',
    'rollupOptions',
  ];
  static NOT_SHORTHANDS = [];
}
