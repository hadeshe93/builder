import WebpackChain from 'webpack-chain';

import { PureBuilderConfig, ProjectConfig } from '@/typings/index';
import HtmlInjectionPlugin, { HtmlInjectionPluginOptions } from '../plugins/html-injection-plugin/index';

/**
 * 用来解析并适配构建配置的插件中间件
 *
 * @export
 * @param {PureBuilderConfig} buildConfig
 * @returns {*}
 */
export default function getPageConfigMw(buildConfig: PureBuilderConfig) {
  return function (chainConfig: WebpackChain): WebpackChain {
    const { projectConfig } = buildConfig;
    // 这里仅需要根据 page 业务配置来做额外处理，build 目前暂时不用
    const { page } = projectConfig;
    const { title, description, useInjection, pxtoremOptions } = page;
    const htmlInjectionPluginOptions: HtmlInjectionPluginOptions = {
      title,
      description,
      useInjection,
      minify: buildConfig.mode === 'production',
      mode: buildConfig.mode,
    };
    // html 操作
    chainConfig.plugin('HtmlInjectionPlugin').use(HtmlInjectionPlugin, [htmlInjectionPluginOptions]);

    // postcss-loader 操作
    if (useInjection?.flexible) {
      const styleProcessorRuleTypes = ['css', 'scss', 'less'];
      styleProcessorRuleTypes.forEach((ruleType) => {
        chainConfig.module
          .rule(ruleType)
          .use('postcss-loader')
          .tap((options) => injectPostcssPxtoremPlugin(options, pxtoremOptions));
      });
    }

    return chainConfig;
  };
}

function injectPostcssPxtoremPlugin(
  postcssLoaderOptions: WebpackChain.LoaderOptions,
  pxtoremOptions: ProjectConfig['page']['pxtoremOptions']
) {
  const options = postcssLoaderOptions;
  const PXTOREM_PLUGIN_NAME = 'postcss-pxtorem';
  const PXTOREM_PLUGIN_ITEM = [PXTOREM_PLUGIN_NAME, pxtoremOptions || {}];
  const postcssPlugins = options.postcssOptions?.plugins || [];
  const existedPxtoremPluginIndex = postcssPlugins.findIndex((item) => {
    if (typeof item === 'string' && item === PXTOREM_PLUGIN_NAME) {
      return true;
    }
    if (Array.isArray(item) && item[0] === PXTOREM_PLUGIN_NAME) {
      return true;
    }
    return false;
  });
  if (existedPxtoremPluginIndex >= 0) {
    postcssPlugins.splice(existedPxtoremPluginIndex, 1, PXTOREM_PLUGIN_ITEM);
  } else {
    postcssPlugins.push(PXTOREM_PLUGIN_ITEM);
  }
  options.postcssOptions = {
    ...(options.postcssOptions || {}),
    plugins: postcssPlugins,
  };
  return options;
}
