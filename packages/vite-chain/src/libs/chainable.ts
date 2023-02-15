export default class Chainable {
  parent: any;

  constructor(parent) {
    // 建立引用关系
    this.parent = parent;
  }

  /**
   * 批量操作
   *
   * @param {*} handler
   * @returns {*} 
   * @memberof Chainable
   */
  batch(handler: (that: this) => any) {
    handler(this);
    return this;
  }

  /**
   * 返回引用
   *
   * @returns {*} 
   * @memberof Chainable
   */
  end(): this['parent'] {
    return this.parent;
  }
};
