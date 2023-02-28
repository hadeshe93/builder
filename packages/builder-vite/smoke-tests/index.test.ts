import path from 'path';
import { BuilderConfig, AppProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderVite from '../src/index';

const projectPath = '/cbs/xcode/webpack5-starter/packages/vite3-vue3';
const pageName = 'demo1';
const projectPagePath = path.resolve(projectPath, 'src', 'pages', pageName);
const projectConfig = require(path.resolve(projectPagePath, 'project.config.js'));
const appProjectConfig: AppProjectConfig = {
  projectPath,
  pageName: 'demo1',
  ...projectConfig,
  // page: {
  //   title: '测试页面12',
  //   description: '测试表述',
  //   useFlexible: true,
  // },
  // build: {
  // },
  // middlewares: [
  //   ['@hadeshe93/vtconfig-mw-vue3']
  // ],
};
process.chdir(projectPath);
console.log('process.cwd():', process.cwd());

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'production',
  builderName: 'vite',
  appProjectConfig,
});

const builder = new BuilderVite();
builder.start(builderConfig);