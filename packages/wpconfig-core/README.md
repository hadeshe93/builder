A convenient configs lib for webpack 5+.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-core --save
```

## Usage

Use it in `CJS` format:

```js
const { getDevChainConfig } = require('@hadeshe93/wpconfig-core');

// return a WebpackChainConfig instance
const devChainConfig = getDevChainConfig({
  projectPath: '/path/to/project',
  page: 'demo1',
});
// get config in json format
const config = devChainConfig.toConfig();
// ...
```

Use it in `ESM` format:

```js
import { getDevChainConfig } from '@hadeshe93/lib-node';

// return a WebpackChainConfig instance
const devChainConfig = getDevChainConfig({
  projectPath: '/path/to/project',
  page: 'demo1',
});
// get config in json format
const config = devChainConfig.toConfig();
// ...
```
