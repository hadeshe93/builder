import type WebpackChainConfig from 'webpack-chain';

export default function() {
  return function(chainConfig: WebpackChainConfig): WebpackChainConfig {
    const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
    chainConfig.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end();
    chainConfig.plugin('VueLoaderPlugin').use(VueLoaderPlugin, []);
    return chainConfig;
  };
}