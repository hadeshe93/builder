import { compose } from '@/utils/compose';

describe('针对 compose 的测试集', () => {
  test('compose 能正常执行', () => {
    const add = (num: number) => num + 1;
    const sub = (num: number) => num - 2;
    const by = (num: number) => num * 100;
    const calc1 = compose([add, sub, by]);
    const calc2 = compose([by, add, sub]);
    expect(calc1(2)).toEqual(100);
    expect(calc2(2)).toBe(199);
  });
});
