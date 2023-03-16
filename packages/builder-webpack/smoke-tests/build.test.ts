import BuilderWebpack, { ProjectConfig } from '../src/index';

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

const builder = new BuilderWebpack();
builder.start({
  mode: 'production',
  builderName: 'webpack',
  projectPath: '/cbs/xcode/web-project-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  projectConfig,
});