A middleware should be used with `webpack-chain` in order to support the app project based on `vue`.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-mw-vue3 --save
```

## Usage

```js
// use it in esm
import ChainConfig from 'webpack-chain';
import getMWVue3 from '@hadeshe93/wpconfig-mw-vue3'

// return a WebpackChainConfig instance
const chainConfig = getMWVue3()(
  new ChainConfig()
);
// get config in json format
const webpackConfig = chainConfig.toConfig();
// ...
```