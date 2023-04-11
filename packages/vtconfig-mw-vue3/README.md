A middleware should be used with `@hadeshe93/vite-chain` in order to support the app project based on `vue`.

## Installation

```sh
$ npm install @hadeshe93/vtconfig-mw-vue3 --save
```

## Usage

```js
// use it in esm
import ChainConfig from '@hadeshe93/vite-chain';
import { Options } from '@vitejs/plugin-vue';
import getMWVue3 from '@hadeshe93/vtconfig-mw-vue3';

// return a ViteChainConfig instance
const options: Options = {
  // ...
};
const chainConfig = getMWVue3(options)(
  new ChainConfig()
);
// get config in json format
const viteConfig = chainConfig.toConfig();
// ...
```