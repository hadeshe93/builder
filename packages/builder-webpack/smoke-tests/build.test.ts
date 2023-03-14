import { BuilderConfig, ProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderWebpack from '../src/index';

const projectConfig: ProjectConfig = {
  page: {
    title: '测试页面',
    description: '',
    useInjection: {
      flexible: true
    },
  },
  build: {
    dllEntryMap: {
      vueStack: ['vue', 'vue-router', 'pinia']
    },
  },
  middlewares: [
    ['@hadeshe93/wpconfig-mw-vue3']
  ],
};

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'production',
  builderName: 'webpack',
  projectPath: '/cbs/xcode/web-project-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  projectConfig,
});
// process.env['NODE_ENV'] = 'production';
const builder = new BuilderWebpack();
builder.start(builderConfig);