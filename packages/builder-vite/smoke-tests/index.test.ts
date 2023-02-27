import { BuilderConfig, AppProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import vtconfigMwVue3 from '@hadeshe93/vtconfig-mw-vue3';
import BuilderVite from '../src/index';

console.log('process.cwd:', process.cwd());
const appProjectConfig: AppProjectConfig = {
  page: {
    title: '测试页面12',
    description: '测试表述',
    useFlexible: true,
  },
  build: {
  },
  projectPath: '/cbs/xcode/webpack5-starter/packages/vite3-vue3',
  pageName: 'demo1',
  middlewares: [
    [vtconfigMwVue3]
  ],
};

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'development',
  builderName: 'vite',
  appProjectConfig,
});

const builder = new BuilderVite();
builder.start(builderConfig).then(() => {
  console.log('启动成功');
});