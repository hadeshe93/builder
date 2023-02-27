import path from 'path';
import fsExtra from 'fs-extra';
import ViteChain from '@hadeshe93/vite-chain';
import pxtorem from 'postcss-pxtorem';
import vitePluginHtml from '../plugins/vite-plugin-html';
import { GetConfigGettersOptions } from '../typings/index';

/**
 * 用来解析并适配构建配置的插件中间件
 *
 * @export
 * @param {BuilderConfig} builderConfig
 * @returns {*} 
 */
 export default function builderConfigAdpoterMiddleware(options: GetConfigGettersOptions) {
  return function(chainConfig: ViteChain): ViteChain {
    const { builderConfig, envConfig } = options;
    const { appProjectConfig } = builderConfig;
    const { assetsPath } = envConfig;
    const presetPartialScript = `${fsExtra.readFileSync(path.resolve(assetsPath, 'partial-scripts.html'), 'utf8')}`;
    // 这里仅需要根据 page 业务配置来做额外处理，build 目前暂时不用
    const { page } = appProjectConfig;
    const { title, description, useFlexible, useDebugger, pxtoremOptions } = page;

    // 处理 index.html
    chainConfig.plugin('vitePluginHtml').use(vitePluginHtml, [{
      title,
      description,
      useFlexible,
      useDebugger,
      presetPartialScript,
    }]);

    // 处理响应式像素
    if (useFlexible) {
      const postcssOptions = chainConfig.css.get('postcss') || {};
      const { plugins = [] } = postcssOptions || {};
      plugins.push(pxtorem(pxtoremOptions));
      chainConfig.css.postcss({
        ...postcssOptions,
        plugins,
      });
    }

    return chainConfig;
  }
}