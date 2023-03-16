import path from 'path';
import BuilderVite, { ProjectConfig } from '../src/index';

const projectPath = '/cbs/xcode/web-project-starter/packages/vite3-vue3';
const pageName = 'demo1';
const projectPagePath = path.resolve(projectPath, 'src', 'pages', pageName);
const projectConfig: ProjectConfig = require(path.resolve(projectPagePath, 'project.config.js'));
process.chdir(projectPath);
console.log('process.cwd():', process.cwd());

const builder = new BuilderVite();
builder.start({
  mode: 'development',
  builderName: 'vite',
  projectPath,
  pageName: 'demo1',
  projectConfig,
});