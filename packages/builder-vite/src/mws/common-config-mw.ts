import path from 'path';
import ViteChain from '@hadeshe93/vite-chain';
import { GetConfigGettersOptions } from '../typings/index';

const getDefaultFefort = () => 5174;
const getDefaultPublicPath = (pageName: string) => path.join(path.sep, pageName, path.sep);
const getDefaultRoot = (projectPath: string, pageName: string) => path.resolve(projectPath, 'src', 'pages', pageName);
const getDefaultCacheDir = (root: string) => path.resolve(root, '.vite');

export default function getCommonChainConfigMw(options: GetConfigGettersOptions) {
  const { builderConfig } = options;
  return function (chainConfig: ViteChain): ViteChain {
    const { mode, appProjectConfig } = builderConfig;
    const { pageName, projectPath, build } = appProjectConfig;
    const { fePort = getDefaultFefort(), publicPath: rawBase = getDefaultPublicPath(pageName) } = build;
    const base = rawBase ? rawBase : getDefaultPublicPath(pageName);
    const root = getDefaultRoot(projectPath, pageName);
    const cacheDir = getDefaultCacheDir(root);
    chainConfig
      .mode(mode)
      .root(root)
      .base(base)
      .cacheDir(cacheDir)
      .server
        .port(fePort)
        .end()
      ;
    if (mode === 'production') {
      chainConfig.build.sourcemap(true);
    } else {
      chainConfig.build.sourcemap('inline');
    }
    
    return chainConfig;
  }
}