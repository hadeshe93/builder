import webpack from 'webpack';
import WebpackChainConfig from 'webpack-chain';
import { getResolve } from '@hadeshe93/lib-node';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';

import { debug } from '../utils/debug';
import { getCommonChainConfig } from './common.config';
import { formatParamsGetChainConfig } from '../utils/formatter';
import { getDllPathMap, getProdDllOutputPath, getProdDllPublicPath } from '../utils/path';

import type { ParamsGetWebpackChainConfigs } from '../typings/configs';

export function getProdChainConfig(oriParams: ParamsGetWebpackChainConfigs, chainConfig = new WebpackChainConfig()) {
  const params = formatParamsGetChainConfig(oriParams);
  chainConfig = getCommonChainConfig(params);

  const resolve = getResolve(params.projectPath);
  const PARAMS_GET_PATH = { resolve, pageName: params.pageName };
  debug('publichPath:', getProdDllPublicPath(params.publicPath));
  debug('plugin outputPath:', getProdDllOutputPath(PARAMS_GET_PATH));
  // plugin: DllPlugin + AddAssetHtmlPlugin
  if (params.dllEntryMap) {
    [...getDllPathMap(params).entries()].forEach(([key, pathInfo]) => {
      const pascalCaseKey = key.replace(/^([\s\S]{1})/, (_, firstLetter: string) => firstLetter.toUpperCase());
      chainConfig
        .plugin(`DllReferencePlugin${pascalCaseKey}`)
        .before('HtmlWebpackPlugin')
        .use(webpack.DllReferencePlugin, [{
          context: params.projectPath,
          manifest: pathInfo.manifestJsonPath,
        }]);
    });
    [...getDllPathMap(params).entries()].forEach(([key, pathInfo]) => {
      const pascalCaseKey = key.replace(/^([\s\S]{1})/, (_, firstLetter: string) => firstLetter.toUpperCase());
      chainConfig
        .plugin(`AddAssetHtmlPlugin${pascalCaseKey}`)
        .after('HtmlWebpackPlugin')
        .use(AddAssetHtmlPlugin, [
          {
            publicPath: getProdDllPublicPath(params.publicPath),
            // outputPath: getProdDllOutputPath(PARAMS_GET_PATH),
            outputPath: '../common/',
            filepath: pathInfo.bundleJsPath,
            includeRelatedFiles: false,
          },
        ]);
    });
  }
  return chainConfig;
}
