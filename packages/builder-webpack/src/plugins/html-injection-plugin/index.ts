import { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HtmlInjector, SupportedBuilderMode } from '@hadeshe93/builder-core';

export type HtmlInjectionPluginOptions = ConstructorParameters<typeof HtmlInjector>[1] & {
  mode: SupportedBuilderMode;
};

export default class HtmlInjectionPlugin {
  name = HtmlInjectionPlugin.name;
  options: HtmlInjectionPluginOptions;

  constructor(options: HtmlInjectionPluginOptions) {
    this.options = formatOptions(options);
  }

  apply(compiler: Compiler) {
    const htmlInjectorMap: Map<string ,HtmlInjector> = new Map();
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(this.name, async (data, cb) => {
        const { mode, ...options } = this.options;
        const { html, plugin } = data;
        const { userOptions: { template } } = plugin;
        let injector = htmlInjectorMap.get(template);
        if (!injector) {
          injector = new HtmlInjector(html, options);
          htmlInjectorMap.set(template, injector);
        } else {
          injector.reloadTemplateHtml(html);
        }
        data.html = await injector.getInjectedHtml({ builder: mode === 'production' ? 'rollup' : 'esbuild' });
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
  const { title = '', description = '', useInjection, minify = false, mode = 'development' } = rawOptions;
  return {
    title,
    description,
    useInjection,
    minify,
    mode,
  };
}