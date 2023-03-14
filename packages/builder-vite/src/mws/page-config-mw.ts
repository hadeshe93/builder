import ViteChain from '@hadeshe93/vite-chain';
import path from 'path';
import pxtorem from 'postcss-pxtorem';
import vitePluginHtml, { HtmlInjectionPluginOptions } from '../plugins/vite-plugin-html';
import { GetConfigGettersOptions } from '../typings/index';

/**
 * 获取页面相关的构建配置中间件
 *
 * @export
 * @param {GetConfigGettersOptions} options
 * @returns {*} 
 */
export default function getPageConfigMw(options: GetConfigGettersOptions) {
  return function(chainConfig: ViteChain): ViteChain {
    const { builderConfig } = options;
    const { mode, projectConfig } = builderConfig;
    // 这里仅需要根据 page 业务配置来做额外处理，build 目前暂时不用
    const { page } = projectConfig;
    const { title, description, useInjection, pxtoremOptions } = page;

    // 处理 index.html
    const root = chainConfig.get('root');
    const vitePluginHtmlOptions: HtmlInjectionPluginOptions = {
      title,
      description,
      useInjection,
      useTerser: mode === 'production',
      indexHtmlEntryPath: path.resolve(root, 'index.html'),
    };
    chainConfig.plugin('vitePluginHtml').use(vitePluginHtml, [vitePluginHtmlOptions]);

    // 处理响应式像素
    if (useInjection?.flexible) {
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