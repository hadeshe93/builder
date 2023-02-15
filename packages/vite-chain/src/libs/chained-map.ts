import merge from 'deepmerge';
import Chainable from './chainable';

export default class ChainedMap extends Chainable {
  store: Map<string, any>;
  shorthands: string[];

  constructor(parent: any) {
    super(parent);
    this.store = new Map();
  }

  /**
   * 扩展方法
   * 适用于可以直接读写的属性
   *
   * @param {string[]} methods
   * @returns {*} 
   * @memberof ChainedMap
   */
  extend(methods: string[]) {
    this.shorthands = methods;
    methods.forEach((method) => {
      this[method] = (value) => this.set(method, value);
    });
    return this;
  }

  /**
   * 清空 map
   *
   * @returns {*} 
   * @memberof ChainedMap
   */
  clear() {
    this.store.clear();
    return this;
  }

  /**
   * 删除键值对
   *
   * @param {string} key
   * @returns {*} 
   * @memberof ChainedMap
   */
  delete(key: string) {
    this.store.delete(key);
    return this;
  }

  /**
   * 给 map 上键排序
   *
   * @returns {*} 
   * @memberof ChainedMap
   */
  order() {
    const entries = [...this.store].reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const names = Object.keys(entries);
    const order = [...names];

    names.forEach((name) => {
      if (!entries[name]) {
        return;
      }

      const { __before, __after } = entries[name];

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before), 0, name);
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after) + 1, 0, name);
      }
    });

    return { entries, order };
  }

  /**
   * 转成 Object 返回
   *
   * @returns {*} 
   * @memberof ChainedMap
   */
  entries() {
    const { entries, order } = this.order();

    if (order.length) {
      return entries;
    }

    return undefined;
  }

  /**
   * 根据顺序返回 value 数组
   *
   * @returns {*} 
   * @memberof ChainedMap
   */
  values() {
    const { entries, order } = this.order();

    return order.map((name) => entries[name]);
  }

  /**
   * 获取 key 对应的 value
   *
   * @param {*} key
   * @returns {*} 
   * @memberof ChainedMap
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * 如果有则返回，没有则设置
   *
   * @param {*} key
   * @param {*} fn
   * @returns {*} 
   * @memberof ChainedMap
   */
  getOrCompute(key, fn) {
    if (!this.has(key)) {
      this.set(key, fn());
    }
    return this.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  set(key, value) {
    this.store.set(key, value);
    return this;
  }

  /**
   * 深度合并
   *
   * @param {*} obj
   * @param {*} [omit=[]]
   * @returns {*} 
   * @memberof ChainedMap
   */
  merge(obj, omit = []) {
    Object.keys(obj).forEach((key) => {
      if (omit.includes(key)) {
        return;
      }

      const value = obj[key];

      if (
        (!Array.isArray(value) && typeof value !== 'object') ||
        value === null ||
        !this.has(key)
      ) {
        this.set(key, value);
      } else {
        this.set(key, merge(this.get(key), value));
      }
    });

    return this;
  }

  /**
   * 清除 undefined、空数组以及空对象
   *
   * @param {*} obj
   * @returns {*} 
   * @memberof ChainedMap
   */
  clean(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];

      if (value === undefined) {
        return acc;
      }

      if (Array.isArray(value) && !value.length) {
        return acc;
      }

      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        !Object.keys(value).length
      ) {
        return acc;
      }

      acc[key] = value;

      return acc;
    }, {});
  }

  /**
   * 根据条件来执行不同的分支
   *
   * @param {*} condition
   * @param {*} [whenTruthy=Function.prototype]
   * @param {*} [whenFalsy=Function.prototype]
   * @returns {*} 
   * @memberof ChainedMap
   */
  when(
    condition,
    whenTruthy = Function.prototype,
    whenFalsy = Function.prototype,
  ) {
    if (condition) {
      whenTruthy(this);
    } else {
      whenFalsy(this);
    }

    return this;
  }
};
