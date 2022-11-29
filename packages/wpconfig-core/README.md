A convenient configs lib for webpack 5+.

## Installation

```sh
$ npm install @hadeshe93/wpconfig-core --save
```

## Usage

First of all, we recommend this architecture in your web app project:

```
.
├── node_modules
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── common
│   ├── pages # put different web app pages
│   │   ├── demo1
│   │   │   ├── app.vue
│   │   │   ├── main.ts # entry for builder
│   │   │   ├── project.config.js
│   │   └── demo2
│   └── types
└── tsconfig.json
```

Use it in `CJS` format:

```js
const { getDevChainConfig } = require('@hadeshe93/wpconfig-core');

// return a WebpackChainConfig instance
const devChainConfig = getDevChainConfig({
  projectPath: '/path/to/project',
  page: 'demo1',
});
// get config in json format
const webpackConfig = devChainConfig.toConfig();
// ...
```

Use it in `ESM` format:

```js
import { getDevChainConfig } from '@hadeshe93/wpconfig-core';

// return a WebpackChainConfig instance
const devChainConfig = getDevChainConfig({
  projectPath: '/path/to/project',
  page: 'demo1',
});
// get config in json format
const webpackConfig = devChainConfig.toConfig();
// ...
```
