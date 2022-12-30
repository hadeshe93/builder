import { getNodeModulePaths, getRequireResolve } from '@hadeshe93/wpconfig-core';
import type WebpackChainConfig from 'webpack-chain';

export default function() {
  return function(chainConfig: WebpackChainConfig): WebpackChainConfig {
    const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
    chainConfig.plugin('VueLoaderPlugin').use(VueLoaderPlugin, []);

    chainConfig.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end();
    
    // vue-loader 比较特殊，这种写法应该可以兼容 npm/yarn 和 pnpm 安装依赖的场景
    const requireResolve = getRequireResolve(getNodeModulePaths([__dirname]));
    chainConfig.merge({
      resolve: {
        fallback: {
          'vue-loader': requireResolve('vue-loader'),
        },
      },
    });
    return chainConfig;
  };
}