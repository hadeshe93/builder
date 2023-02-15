import ChainedSet from '../libs/chained-set';
import ChainedMap from '../libs/chained-map';
import Plugin from '../libs/plugin';

/**
 * 判断对象上是否有对应的属性
 *
 * @export
 * @param {Object} obj
 * @param {string} property
 * @returns {*} 
 */
export function hasOwnProperty(obj: Object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * chainable 对象转 json
 *
 * @export
 * @param {*} obj
 * @returns {*} 
 */
export function chainableToConfig(obj: any) {
  let value: any;
  if ('toConfig' in obj) {
    value = (obj.toConfig as Function)();
  } else if (obj instanceof ChainedSet) {
    value = obj.values();
  } else if (obj instanceof ChainedMap) {
    const values = obj.values();
    if (values[0] instanceof Plugin) {
      value = (values as InstanceType<typeof Plugin>[]).map(plugin => plugin.toConfig())
    } else {
      value = obj.entries();
    }
  } else {
    value = obj;
  }
  return value;
}