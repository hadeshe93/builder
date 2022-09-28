import { resolve as pathResolve } from 'path';

/**
 * 获取定制化的 resolve 方法
 *
 * @export
 * @param {string} projectPath
 * @returns 定制化的 resolve 方法
 */
export function getResolve(projectPath: string): (...pathnameList: string[]) => string {
  return (...pathnameList: string[]) => pathResolve(projectPath, ...pathnameList);
}
