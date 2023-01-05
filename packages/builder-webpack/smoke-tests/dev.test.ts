import { BuilderConfig, AppProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderWebpack from '../src/index';

const appProjectConfig: AppProjectConfig = {
  page: {
    title: '测试页面',
    description: '',
    useFlexible: true,
  },
  build: {
  },
  projectPath: '/cbs/xcode/webpack5-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  middlewares: [
    ['@hadeshe93/wpconfig-mw-vue3']
  ],
};

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'development',
  builderName: 'webpack',
  appProjectConfig,
});

const builder = new BuilderWebpack();
builder.start(builderConfig).then(() => {
  console.log('启动成功');
});