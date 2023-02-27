import * as cheerio from 'cheerio';
export interface HtmlInjectionPluginOptions {
  title?: string;
  description?: string;
  useFlexible?: boolean;
  useDebugger?: boolean;
  presetPartialScript?: string;
}

export default function vitePluginHtml(options: HtmlInjectionPluginOptions) {
  return {
    name: 'vite-plugin-html',
    transformIndexHtml(html: string) {
      const htmlInjector = new HtmlInjector(html, options);
      return htmlInjector.getInjectedHtml(options.presetPartialScript || '');
    },
  };
}

class HtmlInjector {
  templateHtml: string;
  options: HtmlInjectionPluginOptions = {};

  constructor(templateHtml: string, options: HtmlInjectionPluginOptions) {
    this.templateHtml = templateHtml;
    this.options = HtmlInjector.formatOptions(options);
  }

  /**
   * 获取注入片段后的 html 内容
   *
   * @returns {*}  {string}
   * @memberof HtmlInjector
   */
  getInjectedHtml(presetPartialScript = ''): string {
    let scriptContent = presetPartialScript.match(/<script>([\s\S]*)<\/script>/)?.[1] || '';
    const $ = cheerio.load(this.templateHtml);
    if (!this.options.useFlexible) {
      scriptContent = this.removePresetContent(scriptContent, 'useFlexible');
    }
    if (!this.options.useDebugger) {
      scriptContent = this.removePresetContent(scriptContent, 'useDebugger');
    }
    if (this.options.title) {
      $('title').text(String(this.options.title));
    }
    let $desc = $('meta[name="description"]');
    if ($desc.length === 0) {
      $('title').after('<meta name="description" content="">');
    }
    if (this.options.description) {
      $desc = $('meta[name="description"]');
      $desc.attr('content', String(this.options.description));
    }
    if (scriptContent) {
      $('head').append(`<script>${scriptContent}</script>`);
    }
    return $.html();
  }

  /**
   * 移除预设内容
   *
   * @private
   * @param {string} scriptContent
   * @param {string} optionName
   * @returns {*} 
   * @memberof HtmlInjector
   */
  private removePresetContent(scriptContent: string, optionName: string) {
    const startComment = HtmlInjector.optionNameTpl(HtmlInjector.PARTIAL_INJECTION_START_COMMENT, optionName).replace(/\*/g, '\\*');
    const endComment = HtmlInjector.optionNameTpl(HtmlInjector.PARTIAL_INJECTION_END_COMMENT, optionName).replace(/\*/g, '\\*');
    return scriptContent.replace(new RegExp(`${startComment}([\\s\\S]*?)${endComment}`, 'g'), '');
  }

  static PARTIAL_INJECTION_START_COMMENT = '/*START_INJECTION_CONFIG:${optionName}*/';
  static PARTIAL_INJECTION_END_COMMENT = '/*END_INJECTION_CONFIG:${optionName}*/';
  static generateStringTpl(pattern: string | RegExp) {
    return (str: string, val = '') => str.replace(pattern, val || '');
  }
  static optionNameTpl = HtmlInjector.generateStringTpl('${optionName}');
  static formatOptions(rawOptions: HtmlInjectionPluginOptions): HtmlInjectionPluginOptions {
    const { useFlexible, useDebugger } = rawOptions;
    return {
      ...rawOptions,
      useFlexible: useFlexible || false,
      useDebugger: useDebugger || false,
    };
  }
}
