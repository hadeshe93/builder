import BuilderWebpack, { ProjectConfig } from '../src/index';

const projectConfig: ProjectConfig = {
  page: {
    title: '测试页面',
    description: '',
    useInjection: {
      flexible: true,
      debugger: true,
      pageSpeedTester: true,
    },
  },
  build: {
    publicPath: '/demo1/',
    devPort: 3006,
  },
  middlewares: [
    ['@hadeshe93/wpconfig-mw-vue3']
  ],
};


const builder = new BuilderWebpack();
builder.start({
  mode: 'development',
  builderName: 'webpack',
  projectPath: '/cbs/xcode/web-project-starter/packages/webpack5-vue3',
  pageName: 'demo1',
  projectConfig,
}).then(() => {
  console.log('启动成功');
});