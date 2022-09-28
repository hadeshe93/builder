import path from 'path';
import execa from 'execa';

// 环境变量
const { NODE_ENV: ENV_NODE_ENV = 'development' } = process.env;
const env = ENV_NODE_ENV;
const ROOT_DIR = path.resolve(__dirname, '../../');
const resolve = (...args) => path.resolve(ROOT_DIR, ...args);

// 执行代码构建
execa(
  'rollup',
  [
    '--config',
    `${resolve('scripts/draft/rollup.config.js')}`,
    '--environment',
    [`NODE_ENV:${env}`].filter(Boolean).join(','),
  ],
  { stdio: 'inherit' },
);