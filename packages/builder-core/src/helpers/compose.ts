import path from 'path';
import { AppProjectMiddlewares } from '../typings/index';

function actualRequire(moduleName) {
  const middlewareModule = require(moduleName);
  return Object.prototype.hasOwnProperty.call(middlewareModule, 'default') ? middlewareModule.default : middlewareModule;
} 

function loadMiddleware(m: string | Function) {
  if (typeof m === 'function') return m;
  if (path.isAbsolute(m)) {
    return actualRequire(m);
  }
  const absPath = path.resolve(process.cwd(), 'node_modules', m);
  return actualRequire(absPath);
}

/**
 * 组合中间件
 *
 * @export
 * @param {AppProjectMiddlewares} middlewares
 * @returns {*} 
 */
export function compose(middlewares: AppProjectMiddlewares) {
  const mList = middlewares.reduce((sum, m) => {
    const [name, ...options] = m;
    const middleware = loadMiddleware(name)(...options);
    if (middleware) {
      sum.push(middleware);
    }
    return sum;
  }, []);
  return mList.reduce((composedFn, m) => (...args) => composedFn(m(...args)));
}