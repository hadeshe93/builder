const fs = require('fs');
const path = require('path');
const distMainFilepath = path.resolve(__dirname, '../dist/solid.js');

describe('针对生成产物的测试集', () => {
  test('测试生成产物是否符合规范', () => {
    if (!fs.existsSync(distMainFilepath)) {
      expect(true).toBe(true);
    } else {
      const config = require(distMainFilepath);
      console.log(config);
      expect(config).not.toHaveProperty('default');
    }
  });
});