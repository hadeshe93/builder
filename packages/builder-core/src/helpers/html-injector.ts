import { load as cheerioLoad, CheerioAPI } from 'cheerio';
import { rollupBundleString } from "./rollup";
import { esbuildBundleString } from "./esbuild";
import { ProjectConfig } from '@/typings/index';

export type HtmlInjectionPluginOptions = Pick<ProjectConfig['page'], 'title' | 'description' | 'useInjection'> & {
  minify?: boolean;
};

export type GetInjectedHtmlOptions = {
  builder: 'rollup' | 'esbuild';
}

export type InitHtmlInjectorClassOptions = {
  partialScriptEntries: string[];
}

export type HtmlInjectorClosureData = InitHtmlInjectorClassOptions & {
  initialized: boolean;
}

const htmlInjectorClosureData: HtmlInjectorClosureData = {
  initialized: false,
  partialScriptEntries: [],
};
export class HtmlInjector {
  templateHtml: string;
  options: HtmlInjectionPluginOptions = {};
  $: CheerioAPI;
  injectedMap: Map<string, boolean> = new Map();

  constructor(templateHtml: string, options: HtmlInjectionPluginOptions) {
    this.templateHtml = templateHtml;
    this.options = options;
    this.$ = cheerioLoad(templateHtml);
  }

  /**
   * 重载 templateHtml，用于用户修改了模板代码之后
   *
   * @param {string} templateHtml
   */
  reloadTemplateHtml(templateHtml: string) {
    this.templateHtml = templateHtml;
    this.$ = cheerioLoad(templateHtml);
  }

  async getInjectedHtml(opts: GetInjectedHtmlOptions) {
    const { partialScriptEntries = [] } = htmlInjectorClosureData;
    for (const entry of partialScriptEntries) {
      if (this.injectedMap.get(entry)) continue;
      const partialScriptContent = await this.getInjectedPartialScript({
        entry,
        ...opts,
      });
      if (partialScriptContent) {
        this.$('head').append(`<script>${partialScriptContent}</script>`);
        this.injectedMap.set(entry, true);
      }
    }
    return this.$.html();
  }

  async getInjectedPartialScript(opts: GetInjectedHtmlOptions & { entry: string }): Promise<string> {
    const { options } = this;
    const { useInjection, minify } = options;
    const commonOptions = {
      define: {
        __USE_INJECTION__: JSON.stringify(Boolean(useInjection)),
        __USE_INJECTION_DEBUGGER__: JSON.stringify(Boolean(useInjection?.debugger)),
        __USE_INJECTION_FLEXIBLE__: JSON.stringify(Boolean(useInjection?.flexible)),
        __USE_INJECTION_PAGE_SPEED_TESTER__: JSON.stringify(Boolean(useInjection?.pageSpeedTester)),
      },
      minify: Boolean(minify),
    };

    // esbuild 构建
    if (opts.builder === 'esbuild') {
      const bundleOptions = {
        entryPoints: [opts.entry] as string[],
        platform: 'browser',
        ...commonOptions,
      } as const;
      const result = await esbuildBundleString(bundleOptions);
      return result.string;
    }

    // rollup 构建
    const bundleOptions = {
      input: opts.entry,
      target: 'browser',
      ...commonOptions,
    } as const;
    const result = await rollupBundleString(bundleOptions);
    return result.string;
  }

  static init(options: InitHtmlInjectorClassOptions) {
    if (htmlInjectorClosureData.initialized) return false;
    htmlInjectorClosureData.partialScriptEntries = options.partialScriptEntries;
    htmlInjectorClosureData.initialized = true;
    return true;
  }
}
