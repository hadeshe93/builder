import { getCommonChainConfig } from '../src/index';

const chainConfig = getCommonChainConfig({
  projectPath: '/cbs/xcode/web-project-starter/vue3-starter',
  pageName: 'demo1',
});

const lastConfig = chainConfig.toConfig();
console.log(
  lastConfig,
  null,
  2
);