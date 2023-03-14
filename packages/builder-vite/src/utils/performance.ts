
interface AsyncFunc<T = any> {
  (...args: any[]): Promise<T>;
}

interface PerfResult {
  didExcuteSuccessfully: boolean;
  startms: number;
  endms: number;
}

const perfResultsMap: Map<string, PerfResult[]> = new Map();

export async function excuteFuncWithPerfTester<T>(asyncFunc: AsyncFunc<T>, tagName: string): Promise<{ result: T, costms: number }> {
  const startms = new Date().getTime();
  let endms = startms;
  let error;
  let result;
  try {
    result = await asyncFunc();
  } catch (err) {
    error = err;
  } finally {
    endms = new Date().getTime();
  }

  // 计算 & 缓存数据
  const costms = endms - startms;
  const didExcuteSuccessfully = Boolean(error);
  const perfResults = perfResultsMap.get(tagName) || [];
  perfResults.push({
    didExcuteSuccessfully,
    startms,
    endms,
  });
  perfResultsMap.set(tagName, perfResults);

  // 返回结果
  if (didExcuteSuccessfully) {
    return Promise.reject({
      error,
      costms,
    });
  }
  return {
    result,
    costms,
  };
}

export function getPerfResultsMap() {
  return perfResultsMap;
}