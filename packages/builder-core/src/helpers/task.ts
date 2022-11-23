/**
 * 执行任务集
 *
 * @export
 * @param {((...args: any) => any)[]} fns
 * @param {('serial' | 'parallel')} [order='serial']
 * @returns {*} 
 */
 export async function excuteTasks(fns: ((...args: any) => any)[], order: 'serial' | 'parallel' = 'serial') {
  if (order === 'parallel') {
    return await Promise.all(fns.map(fn => fn()));
  }
  if (order === 'serial') {
    const result = [];
    for (const fn of fns) {
      result.push(await fn());
    }
    return result;
  }
}
