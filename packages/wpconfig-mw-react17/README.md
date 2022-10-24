A middleware should be used with `@hadeshe93/wpconfig-core` in order to support the app project based on `react`.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-mw-react17 --save
```

## Usage

```js
// use it in esm
import { getDevChainConfig } from '@hadeshe93/lib-node';
import getMWReact17 from '@hadeshe93/wpconfig-mw-react17'

// return a WebpackChainConfig instance
const devChainConfig = getMWReact17()(
    getDevChainConfig({
      projectPath: '/path/to/project',
      page: 'demo1',
    })
);
// get config in json format
const webpackConfig = devChainConfig.toConfig();
// ...
```