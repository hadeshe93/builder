import path from 'path';
import ViteChain from '@hadeshe93/vite-chain';
import { GetConfigGettersOptions } from '../typings/index';

const getDefaultFefort = () => 5174;
const getDefaultPublicPath = (pageName: string) => path.join(path.sep, pageName, path.sep);
const getDefaultRoot = (projectPath: string, pageName: string) => path.resolve(projectPath, 'src', 'pages', pageName);
const getDefaultCacheDir = (root: string) => path.resolve(root, '.vite');

/**
 * 获取 vite 项目构建的基础性配置中间件
 *
 * @export
 * @param {GetConfigGettersOptions} options
 * @returns {*} 
 */
export default function getCommonConfigMw(options: GetConfigGettersOptions) {
  const { builderConfig } = options;
  return function (chainConfig: ViteChain): ViteChain {
    const { mode, pageName, projectPath, projectConfig } = builderConfig;
    const {  build } = projectConfig;
    const { devPort = getDefaultFefort(), publicPath: rawBase = getDefaultPublicPath(pageName) } = build;
    const base = rawBase ? rawBase : getDefaultPublicPath(pageName);
    const root = getDefaultRoot(projectPath, pageName);
    const cacheDir = getDefaultCacheDir(root);
    chainConfig
      .mode(mode)
      .root(root)
      .base(base)
      .cacheDir(cacheDir)
      ;
    if (mode === 'production') {
      chainConfig.build.sourcemap(true);
    } else {
      chainConfig
        .server
          .port(devPort)
          .end()
        .build
          .sourcemap('inline');
    }
    
    return chainConfig;
  }
}