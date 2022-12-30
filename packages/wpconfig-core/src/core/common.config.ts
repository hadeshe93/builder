// import path from 'path';
import webpack from 'webpack';
import WebpackChainConfig from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { MODE_OBJ } from '../constants/index';
import { getResolve } from '../utils/resolver';
import { formatParamsGetChainConfig } from '../utils/formatter';
import { getAppEntry, getOutputPath, getTemplatePath } from '../utils/path';
import { debug } from '../utils/debug';
import { getRequireResolve, getNodeModulePaths } from '../utils/resolver';
import type { ParamsGetWebpackChainConfigs } from '../typings/configs';

export function getCommonChainConfig(oriParams: ParamsGetWebpackChainConfigs) {
  const params = formatParamsGetChainConfig(oriParams);
  const resolve = getResolve(params.projectPath);

  const MODE = MODE_OBJ.getValue();
  const IS_DEV_MODE = MODE === 'development';
  const PARAMS_GET_PATH = { resolve, pageName: params.pageName };
  const TEMPLATE_PATH = getTemplatePath(PARAMS_GET_PATH);
  const PUBLIC_PATH = params.publicPath;
  const nodeModulePaths = getNodeModulePaths([resolve('./')]);
  const requireResolve = getRequireResolve(nodeModulePaths);

  const chainConfig = new WebpackChainConfig();
  // base
  chainConfig
    .mode(MODE)
    .context(params.projectPath);

  // entry
  chainConfig.entry('index')
    .add(getAppEntry(PARAMS_GET_PATH))
    .end();
  
  // output
  chainConfig.output
    .path(getOutputPath(PARAMS_GET_PATH))
    .filename('[name].[chunkhash:8].js')
    .publicPath(PUBLIC_PATH);

  // module: script
  chainConfig.module
    .rule('script')
    .test(/\.(j|t)sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({
      // 启用缓存机制以防止在重新打包未更改的模块时进行二次编译
      cacheDirectory: true,
      presets: [
        [
          requireResolve('@babel/preset-env'),
          {
            useBuiltIns: 'usage',
            corejs: 3,
            // 将 ES6 Module 的语法交给 Webpack 本身处理
            modules: false,
          },
        ],
        [
          requireResolve('@babel/preset-typescript'),
          {
            allExtensions: true,
          },
        ],
      ],
      plugins: [[requireResolve('@babel/plugin-transform-runtime'), { corejs: 3 }]],
    });

  // module: css | scss | less
  usePostcssLoader(useBaseStyleLoaders(chainConfig.module.rule('css').test(/\.css$/), IS_DEV_MODE));
  usePostcssLoader(
    useBaseStyleLoaders(chainConfig.module.rule('scss').test(/\.scss$/), IS_DEV_MODE)
      .use('sass-loader')
      .loader('sass-loader')
      .end()
  );
  usePostcssLoader(
    useBaseStyleLoaders(chainConfig.module.rule('less').test(/\.less$/), IS_DEV_MODE)
      .use('less-loader')
      .loader('less-loader')
      .end()
  );

  // resolveLoader
  debug(`resolveLoader.modules: ${JSON.stringify(nodeModulePaths, null, 2)}`);
  chainConfig.resolveLoader.modules
    .merge(nodeModulePaths)
    .end();

  // chainConfig.resolveLoader
  //   .modules
  //   .add(resolve('node_modules'))
  //   .add(path.resolve(process.cwd(), 'node_modules'))
  //   .end();


  // module: assets
  chainConfig.module
    .rule('assets')
    .test(/.(png|svg|jpg|jpeg|gif|eot|svg|ttf|woff|woff2)$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: 1024 * 100,
      name: 'assets/images/[name].[contenthash:8].[ext]',
      esModule: false,
    })
    .end()
    .type('javascript/auto');

  // resolve: alias
  chainConfig.resolve.alias.set('@', resolve('src/'));

  // resolve: extensions
  chainConfig.resolve.extensions.add('.ts').add('.tsx').add('...');

  // stats
  chainConfig.stats('normal');

  // plugin: DefinePlugin
  chainConfig.plugin('DefinePlugin').use(webpack.DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(MODE),
    },
  ]);

  // plugin: HtmlWebpackPlugin
  chainConfig.plugin('HtmlWebpackPlugin').use(HtmlWebpackPlugin, [
    {
      filename: 'index.html',
      template: TEMPLATE_PATH,
    },
  ]);

  // plugin: MiniCssExtractPlugin
  chainConfig.when(IS_DEV_MODE, (chainConfig) => {
    // 开发模式下
    // ...
  }, (chainConfig) => {
    // 生产模式下
    chainConfig
      .plugin('MiniCssExtractPlugin')
      .before('HtmlWebpackPlugin')
      .use(MiniCssExtractPlugin, [
        {
          filename: '[name].[contenthash:8].css',
        },
      ]);
  })


  // 最终返回
  return chainConfig;
}

function getStyleLoaderByMode(isDevMode: boolean) {
  return isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader;
}
function useBaseStyleLoaders(moduleRule: WebpackChainConfig.Rule, isDevMode: boolean) {
  return moduleRule
    .use('style-loader')
    .loader(getStyleLoaderByMode(isDevMode))
    .end()
    .use('css-loader')
    .loader('css-loader')
    .end();
}
const usePostcssLoader = (moduleRule: WebpackChainConfig.Rule) => {
  return moduleRule
    .use('postcss-loader')
    .after('css-loader')
    .loader('postcss-loader')
    .options({
      postcssOptions: {
        plugins: [
          [
            'postcss-preset-env',
            {
              autoprefixer: {},
            },
          ],
        ],
      },
    });
};
