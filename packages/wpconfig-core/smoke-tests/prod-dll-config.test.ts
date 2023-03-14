import { getProdDllChainConfig } from '../src/index';

const chainConfig = getProdDllChainConfig({
  projectPath: '/cbs/xcode/web-project-starter/vue3-starter',
  pageName: 'demo1',
  dllEntryMap: {
    vueStack: ['vue', 'vue-router', 'pinia'],
  },
});

const lastConfig = chainConfig.toConfig();
console.log(
  lastConfig,
  null,
  2
);