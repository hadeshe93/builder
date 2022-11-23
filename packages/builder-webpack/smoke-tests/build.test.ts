import { BuilderConfig, AppProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderWebpack from '../src/index';

const appProjectConfig: AppProjectConfig = {
  page: {
    title: '测试页面',
    description: '',
    useFlexible: true,
  },
  build: {
    dllEntryMap: {
      vueStack: ['vue', 'vue-router', 'pinia']
    },
  },
  projectPath: '/cbs/xcode/webpack5-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  middlewares: [
    ['@hadeshe93/wpconfig-mw-vue3']
  ],
};

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'production',
  builderName: 'webpack',
  appProjectConfig,
});

process.env['NODE_ENV'] = 'production';
const builder = new BuilderWebpack();
builder.start(builderConfig);