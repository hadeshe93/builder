import { rollup, RollupOptions, OutputOptions } from 'rollup';
import { load as cheerioLoad, CheerioAPI } from 'cheerio';
import { createRollupConfig } from "./rollup";
import { ProjectConfig } from '@/typings/index';

export type HtmlInjectionPluginOptions = Pick<ProjectConfig['page'], 'title' | 'description' | 'useInjection'> & {
  useTerser?: boolean;
};

export type GetHtmlInjectorClassOptions = {
  partialScriptEntries: string[];
}

// @ts-ignore
export function getHtmlInjectorClass(options: GetHtmlInjectorClassOptions) {
  const { partialScriptEntries } = options;
  return class HtmlInjector {
    templateHtml: string;
    options: HtmlInjectionPluginOptions = {};
    $: CheerioAPI;
    injectedMap: Map<string, boolean> = new Map();
  
    constructor(templateHtml: string, options: HtmlInjectionPluginOptions) {
      this.templateHtml = templateHtml;
      this.options = options;
      this.$ = cheerioLoad(templateHtml);
    }
  
    async getInjectedHtml() {
      for (const entry of partialScriptEntries) {
        if (this.injectedMap.get(entry)) continue;
        const partialScriptContent = await this.getInjectedPartialScript(entry);
        if (partialScriptContent) {
          this.$('head').append(`<script>${partialScriptContent}</script>`);
          this.injectedMap.set(entry, true);
        }
      }
      return this.$.html();
    }
  
    async getInjectedPartialScript(partialScriptEntry: string) {
      const { options } = this;
      const { useInjection, useTerser } = options;
      const rollupConfig = createRollupConfig({
        input: partialScriptEntry,
        format: 'iife',
        sourcemap: false,
        target: 'browser',
        define: {
          __USE_INJECTION__: JSON.stringify(Boolean(useInjection)),
          __USE_INJECTION_DEBUGGER__: JSON.stringify(Boolean(useInjection?.debugger)),
          __USE_INJECTION_FLEXIBLE__: JSON.stringify(Boolean(useInjection?.flexible)),
          __USE_INJECTION_PAGE_SPEED_TESTER__: JSON.stringify(Boolean(useInjection?.pageSpeedTester)),
        },
        useTerser: Boolean(useTerser),
      });
      const { output: outputConfig, ...inputConfig } = rollupConfig;
      const bundle = await rollup(inputConfig as RollupOptions);
      const { output } = await bundle.generate(outputConfig as OutputOptions);
      return output?.[0]?.code || '';
    }
  }
}