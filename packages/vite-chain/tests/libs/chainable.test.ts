import Chainable from '@/libs/chainable';

describe('针对 Chainable 类的测试集', () => {
  test('Chainable 类实例属性和方法', () => {
    const parent = {};
    const chainable = new Chainable(parent);
    const batchFn = jest.fn(() => {});
    expect(chainable).toBeTruthy();
    expect(chainable.parent).toEqual(parent);
    expect(chainable.end()).toEqual(parent);

    chainable.batch(batchFn);
    expect(batchFn).toHaveBeenCalled();
  });
});

