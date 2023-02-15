import ChainedMap from '@/libs/chained-map';

describe('针对 ChainedMap 类的测试集', () => {
  test('ChainedMap 类实例能够进行链式调用', () => {
    const parent = {};
    const chainedMap = new ChainedMap(parent);
    const mapIns = chainedMap
      .set('key1', 1)
      .set('key2', 2)
      .set('key3', 3);
    const parentIns = mapIns.end();
    expect(mapIns).toEqual(chainedMap);
    expect(parentIns).toEqual(parent);
  });
});

