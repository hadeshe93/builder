/**
 * 组合函数
 *
 * @export
 * @param {((...args: any) => any)[]} fns
 * @returns {*} 
 */
 export function compose(fns: ((...args: any) => any)[]) {
  return fns.reduce((composedFn, m) => (...args) => m(composedFn(...args)));
}