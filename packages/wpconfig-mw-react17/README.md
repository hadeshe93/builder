A middleware should be used with `webpack-chain` in order to support the app project based on `react`.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-mw-react17 --save
```

## Usage

```js
// use it in esm
import ChainConfig from 'webpack-chain';
import getMWReact17 from '@hadeshe93/wpconfig-mw-react17'

// return a WebpackChainConfig instance
const chainConfig = getMWReact17()(
  new ChainConfig()
);
// get config in json format
const webpackConfig = chainConfig.toConfig();
// ...
```