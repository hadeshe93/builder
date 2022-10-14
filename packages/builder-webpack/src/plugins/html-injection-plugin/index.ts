import fs from 'fs-extra';
import path from 'path';
import { Compiler } from 'webpack';
import * as cheerio from 'cheerio';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export interface HtmlInjectionPluginOptions {
  title?: string;
  description?: string;
  useFlexible?: boolean;
  useDebugger?: boolean;
}

function generateStringTpl(pattern: string | RegExp) {
  return (str: string, val = '') => str.replace(pattern, val || '');
}


// eslint-disable-next-line prettier/prettier, no-useless-escape
const PARTIAL_INJECTION_START_COMMENT = '/*START_INJECTION_CONFIG:${optionName}*/';
// eslint-disable-next-line prettier/prettier, no-useless-escape
const PARTIAL_INJECTION_END_COMMENT = '/*END_INJECTION_CONFIG:${optionName}*/';
const optionNameTpl = generateStringTpl('${optionName}');

export default class HtmlInjectionPlugin {
  name = HtmlInjectionPlugin.name;
  options: HtmlInjectionPluginOptions = {};

  constructor(options: HtmlInjectionPluginOptions) {
    this.options = formatOptions(options);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(this.name, async (data, cb) => {
        const $ = cheerio.load(data.html);
        let scriptContent = fs.readFileSync(path.resolve(__dirname, './partial-scripts.js'), 'utf-8') as string;
        if (!this.options.useFlexible) {
          scriptContent = this.removePresetContent(scriptContent, 'useFlexible');
        }
        if (!this.options.useDebugger) {
          scriptContent = this.removePresetContent(scriptContent, 'useDebugger');
        }
        if (this.options.title) {
          $('title').text(String(this.options.title));
        }
        if (this.options.description) {
          $('meta[name="description"]').attr('content', String(this.options.description));
        }
        $('head').append(`<script>${scriptContent}</script>`);
        data.html = $.html();
        cb(null, data);
      });
    });
  }

  removePresetContent(scriptContent: string, optionName: string) {
    const startComment = optionNameTpl(PARTIAL_INJECTION_START_COMMENT, optionName).replace(/\*/g, '\\*');
    const endComment = optionNameTpl(PARTIAL_INJECTION_END_COMMENT, optionName).replace(/\*/g, '\\*');
    return scriptContent.replace(new RegExp(`${startComment}([\\s\\S]*?)${endComment}`, 'g'), '');
  }
}

/**
 * 格式化入参 options
 *
 * @param {HtmlInjectionPluginOptions} rawOptions
 * @returns {*}  {HtmlInjectionPluginOptions}
 */
function formatOptions(rawOptions: HtmlInjectionPluginOptions): HtmlInjectionPluginOptions {
  const { useFlexible, useDebugger } = rawOptions;
  return {
    ...rawOptions,
    useFlexible: useFlexible || false,
    useDebugger: useDebugger || false,
  };
}