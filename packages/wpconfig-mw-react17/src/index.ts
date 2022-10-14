import type WebpackChainConfig from 'webpack-chain';

export default function() {
  return function(chainConfig: WebpackChainConfig): WebpackChainConfig {
    chainConfig.module
      .rule('script')
      .use('babel')
      .tap(options => {
        // 0. set constants
        const BABEL_PRESET_TYPESCRIPT = '@babel/preset-typescript';
        const BABEL_PRESET_REACT = '@babel/preset-react';
        const REACT_REFRESH_WEBPACK_PLUGIN = '@pmmmwh/react-refresh-webpack-plugin';

        // 1. set the 'allExtensions' option to false when using react
        const presetTsIndex = options.presets.findIndex(item => item[0] === BABEL_PRESET_TYPESCRIPT);
        const presetTs = options.presets[presetTsIndex];
        if (Array.isArray(presetTs)) {
          presetTs[1] = {
            ...(presetTs[1] || {}),
            allExtensions: false,
          }
        }
        // 2. add the preset named '@babel/preset-react' and place it before '@babel/preset-typescript'
        if (presetTsIndex > -1) {
          options.presets.splice(presetTsIndex, 0, BABEL_PRESET_REACT);
        } else {
          options.presets.push(BABEL_PRESET_REACT);
        }
        // 3. add react refresh plugin for webpack
        chainConfig.plugin(REACT_REFRESH_WEBPACK_PLUGIN)
          .use(require(REACT_REFRESH_WEBPACK_PLUGIN), [{ overlay: false }])
        return options;
      });
    return chainConfig;
  };
}