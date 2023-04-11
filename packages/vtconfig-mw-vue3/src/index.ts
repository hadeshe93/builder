import ViteChain from '@hadeshe93/vite-chain';
import vitePluginVue, { Options } from '@vitejs/plugin-vue';

export default function(options: Options) {
  return function(chainConfig: ViteChain): ViteChain {
    chainConfig
      .plugin('vitePluginVue')
      .use(vitePluginVue, options ? [options] : [])
      .end();
    return chainConfig;
  };
}