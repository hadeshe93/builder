import { getNodeModulePaths, getRequireResolve } from '@hadeshe93/wpconfig-core';
import type WebpackChainConfig from 'webpack-chain';

export default function() {
  return function(chainConfig: WebpackChainConfig): WebpackChainConfig {
    // 在插件中持有 vue-loader，不需要在业务项目中安装
    const requireResolve = getRequireResolve(getNodeModulePaths([__dirname]));
    const vueLoaderAbsPath = requireResolve('vue-loader');
    const VueLoaderPlugin = require(vueLoaderAbsPath).VueLoaderPlugin;
    chainConfig.plugin('VueLoaderPlugin').use(VueLoaderPlugin, []);

    chainConfig.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader(vueLoaderAbsPath)
      .end();

    return chainConfig;
  };
}