import ViteChain from '@hadeshe93/vite-chain';
import solidPlugin, { Options, ExtensionOptions } from 'vite-plugin-solid';

export default function(options: Options) {
  return function(chainConfig: ViteChain): ViteChain {
    chainConfig
      .plugin('vitePluginSolid')
      .use(solidPlugin, options ? [options] : [])
      .end();
    return chainConfig;
  };
}

export {
  Options,
  ExtensionOptions,
};