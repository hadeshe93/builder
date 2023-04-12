A middleware should be used with `@hadeshe93/vite-chain` in order to support the app project based on `vue`.

## Installation

```sh
$ npm install @hadeshe93/vtconfig-mw-solid --save
```

## Usage

```js
// use it in esm
import ChainConfig from '@hadeshe93/vite-chain';
import getMWSolid, { Options } from '@hadeshe93/vtconfig-mw-solid';

// return a ViteChainConfig instance
const options: Options = {
  // ...
};
const chainConfig = getMWSolid(options)(
  new ChainConfig()
);
// get config in json format
const viteConfig = chainConfig.toConfig();
// ...
```