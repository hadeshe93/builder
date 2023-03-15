import { IndexHtmlTransformContext } from 'vite';
import { HtmlInjector, SupportedBuilderMode } from '@hadeshe93/builder-core';
import { excuteFuncWithPerfTester } from '../../utils/performance';
import { debug } from '../../utils/debug';

export type HtmlInjectionPluginOptions = ConstructorParameters<typeof HtmlInjector>[1] & {
  mode: SupportedBuilderMode;
  indexHtmlEntryPath: string;
};

export default function vitePluginHtml(rawOptions: HtmlInjectionPluginOptions) {
  const htmlInjectorMap: Map<string, HtmlInjector> = new Map();
  const { indexHtmlEntryPath, mode, ...options } = rawOptions;
  return {
    name: 'vite-plugin-html',
    async transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      const { filename } = ctx;
      if (filename !== indexHtmlEntryPath) return html;

      let htmlInjector = htmlInjectorMap.get(filename);
      if (!htmlInjector) {
        htmlInjector = new HtmlInjector(html, options);
        htmlInjectorMap.set(filename, htmlInjector)
      } else {
        htmlInjector.reloadTemplateHtml(html);
      }

      const { result: latestHtml, costms } = await excuteFuncWithPerfTester(
        () => htmlInjector.getInjectedHtml({ builder: mode === 'production' ? 'rollup' : 'esbuild' }),
        'htmlInjector.getInjectedHtml'
      );
      debug('[transformIndexHtml] costms:', costms);
      return latestHtml;
    },
  };
}
