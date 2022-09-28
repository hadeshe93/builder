import { getDevChainConfig } from '../src/index';

const chainConfig = getDevChainConfig({
  projectPath: '/cbs/xcode/webpack5-starter/vue3-starter',
  pageName: 'demo1',
});

const lastConfig = chainConfig.toConfig();
console.log(
  lastConfig,
  null,
  2
);