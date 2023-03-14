import { BuilderConfig, ProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderWebpack from '../src/index';

const projectConfig: ProjectConfig = {
  page: {
    title: '测试页面',
    description: '',
    useInjection: {
      flexible: true,
    },
  },
  build: {
    publicPath: '/demo1/',
  },
  middlewares: [
    ['@hadeshe93/wpconfig-mw-vue3']
  ],
};

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'development',
  builderName: 'webpack',
  projectPath: '/cbs/xcode/web-project-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  projectConfig,
});

const builder = new BuilderWebpack();
builder.start(builderConfig).then(() => {
  console.log('启动成功');
});