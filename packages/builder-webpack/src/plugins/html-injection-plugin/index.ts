import { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HtmlInjector } from '@hadeshe93/builder-core';

export type HtmlInjectionPluginOptions = ConstructorParameters<typeof HtmlInjector>[1];

export default class HtmlInjectionPlugin {
  name = HtmlInjectionPlugin.name;
  options: HtmlInjectionPluginOptions = {};

  constructor(options: HtmlInjectionPluginOptions) {
    this.options = formatOptions(options);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(this.name, async (data, cb) => {
        const injector = new HtmlInjector(data.html, this.options);
        data.html = await injector.getInjectedHtml();
        cb(null, data);
      });
    });
  }
}

/**
 * 格式化入参 options
 *
 * @param {HtmlInjectionPluginOptions} rawOptions
 * @returns {*}  {HtmlInjectionPluginOptions}
 */
function formatOptions(rawOptions: HtmlInjectionPluginOptions): HtmlInjectionPluginOptions {
  const { title = '', description = '', useInjection, useTerser = false } = rawOptions;
  return {
    title,
    description,
    useInjection,
    useTerser,
  };
}