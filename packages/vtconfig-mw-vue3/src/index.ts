import ViteChain from '@hadeshe93/vite-chain';
import vitePluginVue from '@vitejs/plugin-vue';

export default function() {
  return function(chainConfig: ViteChain): ViteChain {
    chainConfig.plugin('vitePluginVue').use(vitePluginVue).end();
    return chainConfig;
  };
}