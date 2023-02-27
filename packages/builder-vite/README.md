A chainable tool work with vite just like "webpack-chain".

And i am still working on it.

## Installation

```sh
$ npm install @hadeshe93/vite-chain
```

## Usage

```js
import ViteChain from '@hadeshe93/vite-chain';
import vue from '@vitejs/plugin-vue'
const chainConfig = new ViteChain();

const finalViteConfig =
  chainConfig
    .plugin('vue')
      .use(vue())
      .end()
    .toConfig();
```