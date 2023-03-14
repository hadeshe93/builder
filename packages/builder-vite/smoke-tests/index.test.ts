import path from 'path';
import { BuilderConfig, ProjectConfig, formatBuilderConfig } from '@hadeshe93/builder-core';
import BuilderVite from '../src/index';

const projectPath = '/cbs/xcode/web-project-starter/packages/vite3-vue3';
const pageName = 'demo1';
const projectPagePath = path.resolve(projectPath, 'src', 'pages', pageName);
const projectConfig: ProjectConfig = require(path.resolve(projectPagePath, 'project.config.js'));
process.chdir(projectPath);
console.log('process.cwd():', process.cwd());

const builderConfig: BuilderConfig = formatBuilderConfig({
  mode: 'development',
  builderName: 'vite',
  projectPath,
  pageName: 'demo1',
  projectConfig,
});

const builder = new BuilderVite();
builder.start(builderConfig);