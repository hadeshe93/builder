import { nanoid } from 'nanoid';
import { load as cheerioLoad, CheerioAPI } from 'cheerio';

import { debug } from '../utils/debug';
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
  injectedMap: Map<string, { id: string, partialScriptContent: string }> = new Map();

  constructor(templateHtml: string, options: HtmlInjectionPluginOptions) {
    this.reloadTemplateHtml(templateHtml, options);
  }

  /**
   * 重载 templateHtml，用于用户修改了模板代码之后
   *
   * @param {string} templateHtml
   */
  reloadTemplateHtml(templateHtml: string, options?: HtmlInjectionPluginOptions) {
    if (options) {
      this.options = options;
    }
    const $ = cheerioLoad(templateHtml);
    // 处理基本元素
    const { title, description } = this.options;
    const $title = $('title');
    if ($title.length === 0) {
      $('head').append(`<title>${title}</title>`);
    } else {
      $title.text(title);
    }
    const $desc = $('meta[name="description"]');
    if ($desc.length === 0) {
      $('title').after(`<meta name="description" content="${description}">`);
    } else {
      $desc.attr('content', description);
    }

    // 最后赋值
    this.templateHtml = templateHtml;
    this.$ = $;
    const theHtml = $.html();
    debug(`[reloadTemplateHtml] ${theHtml}`);
  }

  async getInjectedHtml(opts: GetInjectedHtmlOptions) {
    const { partialScriptEntries = [] } = htmlInjectorClosureData;
    for (const entry of partialScriptEntries) {
      const cache = this.injectedMap.get(entry);
      const stillCacheInHtml = Boolean(cache?.id) && this.$(`script[data-id="${cache.id}"]`).length > 0;
      if (stillCacheInHtml) continue;

      let partialScriptContent = cache?.partialScriptContent || '';
      if (!partialScriptContent) {
        partialScriptContent = await this.getInjectedPartialScript({
          entry,
          ...opts,
        });
      }
      if (partialScriptContent) {
        const id = cache?.id || nanoid();
        this.$('head').append(`<script data-id="${id}">${partialScriptContent}</script>`);
        this.injectedMap.set(entry, { id, partialScriptContent });
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
