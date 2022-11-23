import webpack from 'webpack';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';

import { getResolve } from '../utils/resolver';
import { getCommonChainConfig } from './common.config';
import { formatParamsGetChainConfig } from '../utils/formatter';
import { getDllPathMap, getProdDllOutputPath, getProdDllPublicPath } from '../utils/path';

import type { ParamsGetWebpackChainConfigs } from '../typings/configs';

export function getProdChainConfig(oriParams: ParamsGetWebpackChainConfigs) {
  const params = formatParamsGetChainConfig(oriParams);
  const chainConfig = getCommonChainConfig(params);
  const resolve = getResolve(params.projectPath);
  const PARAMS_GET_PATH = { resolve, pageName: params.pageName };
  console.log('PARAMS_GET_PATH:', PARAMS_GET_PATH, JSON.stringify(params));
  console.log('publichPath:', getProdDllPublicPath(params.publicPath));
  console.log('plugin outputPath:', getProdDllOutputPath(PARAMS_GET_PATH));
  console.log('getProdDllOutputPath:', getProdDllOutputPath);
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
