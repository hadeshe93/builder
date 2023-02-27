A middleware should be used with `@hadeshe93/wpconfig-core` in order to support the app project based on `vue`.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-mw-vue3 --save
```

## Usage

```js
// use it in esm
import { getDevChainConfig } from '@hadeshe93/wpconfig-core';
import getMWVue3 from '@hadeshe93/wpconfig-mw-vue3'

// return a WebpackChainConfig instance
const devChainConfig = getMWVue3()(
    getDevChainConfig({
      projectPath: '/path/to/project',
      page: 'demo1',
    })
);
// get config in json format
const webpackConfig = devChainConfig.toConfig();
// ...
```