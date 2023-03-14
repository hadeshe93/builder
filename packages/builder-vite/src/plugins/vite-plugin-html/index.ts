import { IndexHtmlTransformContext } from 'vite';
import { HtmlInjector } from '@hadeshe93/builder-core';
import { excuteFuncWithPerfTester } from '../../utils/performance';
import { debug } from '../../utils/debug';

export type HtmlInjectionPluginOptions = ConstructorParameters<typeof HtmlInjector>[1] & {
  indexHtmlEntryPath: string;
};

export default function vitePluginHtml(rawOptions: HtmlInjectionPluginOptions) {
  let htmlInjector;
  const { indexHtmlEntryPath, ...options } = rawOptions
  return {
    name: 'vite-plugin-html',
    async transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      if (ctx.filename !== indexHtmlEntryPath) return html;

      if (!htmlInjector) {
        htmlInjector = new HtmlInjector(html, options);
      }
      const { result: latestHtml, costms } = await excuteFuncWithPerfTester(() => htmlInjector.getInjectedHtml(), 'htmlInjector.getInjectedHtml()');
      debug('[transformIndexHtml] costms:', costms);
      return latestHtml;
    },
  };
}

