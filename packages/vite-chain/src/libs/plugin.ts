import ChainedMap from './chained-map';
import orderable from './orderable';
import { hasOwnProperty } from '../utils/object';

type Args = any[];

@orderable<typeof Plugin>
class Plugin extends ChainedMap {
  name: string;
  type: string;
  init: (value) => any;

  constructor(parent, name, type = 'plugin') {
    super(parent);
    this.name = name;
    this.type = type;
    this.extend(['init']);

    this.init((Plugin, args = []) => {
      if (typeof Plugin === 'function') {
        return new Plugin(...args);
      }
      return Plugin;
    });
  }

  use(plugin: any, args: Args = []) {
    return this.set('plugin', plugin).set('args', args);
  }

  tap(f: (args: Args) => Args) {
    if (!this.has('plugin')) {
      throw new Error(
        `Cannot call .tap() on a plugin that has not yet been defined. Call ${this.type}('${this.name}').use(<Plugin>) first.`,
      );
    }
    this.set('args', f(this.get('args') || []));
    return this;
  }

  set(key, value) {
    if (key === 'args' && !Array.isArray(value)) {
      throw new Error('args must be an array of arguments');
    }
    return super.set(key, value);
  }

  merge(obj, omit = []) {
    if (hasOwnProperty(obj, 'plugin')) {
      this.set('plugin', obj.plugin);
    }

    if (hasOwnProperty(obj, 'args')) {
      this.set('args', obj.args);
    }

    return super.merge(obj, [...omit, 'args', 'plugin']);
  }

  toConfig() {
    const init = this.get('init');
    const args = this.get('args');
    let plugin = this.get('plugin');
    let pluginPath = null;

    if (plugin === undefined) {
      throw new Error(
        `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
      );
    }

    // Support using the path to a plugin rather than the plugin itself,
    // allowing expensive require()s to be skipped in cases where the plugin
    // or webpack configuration won't end up being used.
    if (typeof plugin === 'string') {
      pluginPath = plugin;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      plugin = require(pluginPath);
    }

    const constructorName = plugin.__expression
      ? `(${plugin.__expression})`
      : plugin.name;

    // 执行插件的实例化
    const config = init(plugin, args);

    Object.defineProperties(config, {
      __pluginName: { value: this.name },
      __pluginType: { value: this.type },
      __pluginArgs: { value: args },
      __pluginConstructorName: { value: constructorName },
      __pluginPath: { value: pluginPath },
    });

    return config;
  }
}

export default Plugin;

