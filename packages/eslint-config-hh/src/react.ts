import deepmerge from 'deepmerge';
import baseConfig from './base';

export = deepmerge(baseConfig, {
  parserOptions: {
    babelOptions: {
      // babelrc: false,
      // configFile: false,
      presets: ['@babel/preset-env', 'babel-preset-react'],
    },
  },
  plugins: ['react'],
});