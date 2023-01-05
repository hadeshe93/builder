import assert from 'assert';
import webpack from 'webpack';
import WebpackChainConfig from 'webpack-chain';

import { getResolve } from '../utils/resolver';
import { getEnvMode } from '../utils/mode';
import { formatParamsGetChainConfig } from '../utils/formatter';
import { getProdDllOutputPath, getProdDllManifestOutputPath } from '../utils/path';
import type { ParamsGetWebpackChainConfigs } from '../typings/configs';

export function getProdDllChainConfig(oriParams: ParamsGetWebpackChainConfigs) {
  const params = formatParamsGetChainConfig(oriParams);
  assertParams(params);

  const resolve = getResolve(params.projectPath);
  const OUTPUT_PATH = getProdDllOutputPath({ resolve });
  const MODE = getEnvMode(params.mode);

  const chainConfig = new WebpackChainConfig();
  // base
  chainConfig
    .mode(MODE)
    .context(params.projectPath);
  
  // entry
  Object.entries(params.dllEntryMap).forEach(([key, list]) => {
    const entryPoint = chainConfig.entry(key);
    list.forEach((item) => {
      entryPoint
        .add(item)
    });
    entryPoint.end();
  });
  
  // output
  chainConfig.output
    .path(OUTPUT_PATH)
    .library('[name]_[fullhash]')
    .filename('[name]_[fullhash].js');

  // plugin
  chainConfig.plugin('DllPlugin')
    .use(webpack.DllPlugin, [{
      context: params.projectPath,
      name: '[name]_[fullhash]',
      path: getProdDllManifestOutputPath({ resolve }),
    }]);


  // 最终返回
  return chainConfig;
}

function assertParams(params: Partial<ParamsGetWebpackChainConfigs>) {
  const { dllEntryMap, projectPath } = params;
  const msgPrefix = '[DllPlugin]';
  assert.ok(dllEntryMap, `${msgPrefix} dllEntryMap 无效`);
  assert.ok(projectPath, `${msgPrefix} projectPath 无效`);
}
