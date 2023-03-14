import path from 'path';
import { asyncCompose } from '../utils/fp';
import { ProjectMiddlewares, AnyFunction } from '../typings/index';

function actualRequire(moduleName) {
  const middlewareModule = require(moduleName);
  return Object.prototype.hasOwnProperty.call(middlewareModule, 'default') ? middlewareModule.default : middlewareModule;
} 

/**
 * 加载中间件
 *
 * @export
 * @param {(string | Function)} m
 * @returns {*} 
 */
export function loadMiddleware(m: string | Function) {
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
 * @param {ProjectMiddlewares} middlewares
 * @returns {*} 
 */
export async function composeMiddlewares(middlewares: ProjectMiddlewares) {
  const mList = await Promise.all(
    middlewares.reduce((sum, m) => {
      const [name, ...options] = m;
      const middleware = loadMiddleware(name)(...options);
      if (middleware) {
        sum.push(middleware);
      }
      return sum;
    }, [] as AnyFunction[])
  );
  return asyncCompose(mList);
}