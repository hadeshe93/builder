import path from 'path';
import { esbuildDynamicImport } from '@hadeshe93/builder-core';
import BuilderVite, { ProjectConfig } from '../src/index';

async function main() {
  const projectPath = '/cbs/xcode/web-project-starter/packages/webpack5-vue3';
  const pageName = 'demo1';
  const projectPagePath = path.resolve(projectPath, 'src', 'pages', pageName);
  const projectConfig: ProjectConfig = await esbuildDynamicImport(path.resolve(projectPagePath, 'project.config.ts'));
  process.chdir(projectPath);
  console.log('process.cwd():', process.cwd());

  const builder = new BuilderVite();
  builder.start({
    mode: 'production',
    builderName: 'webpack',
    projectPath,
    pageName: 'demo1',
    projectConfig,
  });
}

main();